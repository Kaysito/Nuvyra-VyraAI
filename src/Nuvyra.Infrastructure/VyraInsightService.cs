using Nuvyra.Application;
using Nuvyra.Contracts;
using Nuvyra.Domain;

namespace Nuvyra.Infrastructure;

public sealed class VyraInsightService(
    ILiveMarketDataProvider liveMarket,
    IMarketDataProvider sandboxMarket,
    ContextualInsightEngine engine) : IVyraInsightService
{
    public async Task<VyraInsightResponse> GenerateAsync(
        VyraInsightRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        if (!TryParseCode(request.IntendedAction, out InsightIntent intent) ||
            !TryParseCode(request.Environment, out InsightEnvironment environment) ||
            !TryParseCode(request.Scenario, out InsightScenario scenario))
            throw new ArgumentException("Insight values must use the documented codes.");
        if (environment == InsightEnvironment.Market && scenario != InsightScenario.Baseline)
            throw new ArgumentException("Market insights only support the baseline scenario.");

        var quote = environment == InsightEnvironment.Market
            ? (await liveMarket.GetQuotesAsync(cancellationToken)).SingleOrDefault(item =>
                item.Symbol.Equals(request.Symbol, StringComparison.OrdinalIgnoreCase))
            : sandboxMarket.GetQuotes().SingleOrDefault(item =>
                item.Symbol.Equals(request.Symbol, StringComparison.OrdinalIgnoreCase));
        if (quote is null) throw new KeyNotFoundException("Asset not found.");

        if (environment == InsightEnvironment.Sandbox && scenario == InsightScenario.Crash)
            quote = quote with
            {
                Price = quote.Price * 0.72m,
                Change24Hours = -28m,
                VolatilityScore = 96,
                Source = "sandbox-simulation",
                AsOf = DateTimeOffset.UtcNow
            };

        var insight = engine.Analyze(quote, intent, ToProfile(request.Profile), request.VirtualExposurePercent);
        return new(
            insight.Id,
            insight.Title,
            insight.Observation,
            insight.Factors.Select(factor => new InsightFactorResponse(factor.Code, factor.Message)).ToArray(),
            insight.ReflectionQuestions,
            insight.BehavioralSignals,
            insight.Source,
            insight.MarketSource,
            true,
            insight.GeneratedAt,
            "Contenido educativo. VyraAI contextualiza información; no predice rendimientos ni decide por ti.");
    }

    private static InvestorProfile? ToProfile(InsightProfileContext? profile)
    {
        if (profile is null) return null;
        if (!string.Equals(profile.AssessmentVersion, "pulse-v1", StringComparison.OrdinalIgnoreCase) ||
            !TryParseCode(profile.Experience, out ExperienceLevel experience) ||
            !TryParseCode(profile.RiskDisposition, out RiskDisposition risk) ||
            !TryParseCode(profile.Horizon, out InvestmentHorizon horizon) ||
            !TryParseCode(profile.Objective, out InvestmentObjective objective) ||
            !TryParseCode(profile.PressureResponse, out PressureResponse pressure))
            throw new ArgumentException("Profile values must use the documented pulse-v1 codes.");

        return new(Guid.NewGuid(), experience, risk, horizon, objective, pressure, true, "pulse-v1", DateTimeOffset.UtcNow);
    }

    private static bool TryParseCode<T>(string? value, out T result) where T : struct, Enum
    {
        result = default;
        return !string.IsNullOrWhiteSpace(value)
            && !int.TryParse(value, out _)
            && Enum.TryParse(value, true, out result)
            && Enum.IsDefined(result);
    }
}
