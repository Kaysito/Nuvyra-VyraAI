using Nuvyra.Application;
using Nuvyra.Contracts;
using Nuvyra.Domain;

namespace Nuvyra.Infrastructure;

public sealed class NuvyraDemoService : INuvyraDemoService
{
    private readonly object _gate = new();
    private readonly VirtualPortfolio _portfolio = new(10_000m);
    private readonly Dictionary<Guid, DecisionIntervention> _interventions = [];
    private readonly Dictionary<string, MarketQuote> _quotes = new(StringComparer.OrdinalIgnoreCase)
    {
        ["BTC"] = new("BTC", "Bitcoin", 112_450m, 2.4m, 72),
        ["ETH"] = new("ETH", "Ethereum", 4_380m, -1.8m, 79),
        ["SOL"] = new("SOL", "Solana", 214m, 5.2m, 88)
    };

    public ProfileResponse Assess(ProfileAssessmentRequest request)
    {
        var result = BehavioralFinanceRules.Assess(request.Answers);
        var profile = new InvestorProfile(
            Guid.NewGuid(),
            result.Experience,
            result.Tolerance,
            result.Horizon,
            result.Objective,
            result.BehavioralRisk,
            result.Clarity,
            DateTimeOffset.UtcNow);

        return new(
            profile.Id,
            Display(profile.Experience),
            Display(profile.RiskTolerance),
            Display(profile.Horizon),
            Display(profile.Objective),
            RiskBand(profile.BehavioralRiskScore),
            profile.BehavioralRiskScore,
            profile.Clarity);
    }

    public IReadOnlyCollection<object> GetQuotes() => _quotes.Values.Cast<object>().ToArray();

    public IReadOnlyCollection<PulseQuestionContract> GetPulse() => LearningContent.Pulse;

    public IReadOnlyCollection<LessonContract> GetLessons() => LearningContent.Lessons;

    public IReadOnlyCollection<CourseModuleContract> GetCourse() => LearningContent.Course;

    public BehaviorSignalContract? CheckBehavior(BehaviorCheckRequest request)
    {
        var horizon = ParseHorizon(request.ChosenHorizon);
        var requestedHorizon = ParseHorizon(request.RequestedHorizon);
        var context = new DecisionContext(
            request.RecentRisePercent,
            request.PortfolioConcentrationPercent,
            request.PlanChanges,
            request.RecentDropPercent,
            request.CompleteLiquidation,
            horizon,
            requestedHorizon);

        var panic = BehavioralFinanceRules.DetectPanicSelling(context);
        var fomo = BehavioralFinanceRules.DetectFomo(context);
        var signal = panic ?? fomo;
        return signal is null ? null : new(
            signal.Id,
            signal.Type.ToString(),
            signal.Level.ToString(),
            signal.Message,
            signal.Metrics,
            signal.RecommendedAction);
    }

    public PositionResponse Buy(BuyOrderRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            return ToResponse(_portfolio.Buy(quote.Symbol, request.Amount, quote.Price), quote);
        }
    }

    public PortfolioResponse GetPortfolio()
    {
        lock (_gate)
            return new(_portfolio.Cash, _portfolio.Positions.Select(position => ToResponse(position, Quote(position.Symbol))).ToArray());
    }

    public void SimulateCrash()
    {
        lock (_gate)
            foreach (var symbol in _quotes.Keys.ToArray())
            {
                var quote = _quotes[symbol];
                _quotes[symbol] = quote with { Price = quote.Price * 0.72m, Change24Hours = -28m, VolatilityScore = 96 };
            }
    }

    public InterventionResponse BeforeSell(BeforeSellRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            var position = _portfolio.Positions.SingleOrDefault(item => item.Symbol.Equals(quote.Symbol, StringComparison.OrdinalIgnoreCase))
                ?? throw new KeyNotFoundException("Position not found.");
            var loss = position.ReturnPercent(quote.Price);
            var urgency = Math.Clamp((int)Math.Abs(Math.Min(loss, 0)) * 2 + quote.VolatilityScore / 2, 0, 100);
            var intervention = new DecisionIntervention(
                Guid.NewGuid(),
                quote.Symbol,
                loss,
                urgency,
                "El mercado cayó con fuerza. Antes de vender, revisa la razón de la señal, el movimiento reciente y tu horizonte. Nuvyra muestra contexto y recomienda revisar; la decisión sigue siendo tuya.",
                [DecisionChoice.Wait24Hours, DecisionChoice.ReviewEvidence, DecisionChoice.ContinueSale],
                DateTimeOffset.UtcNow);
            _interventions[intervention.Id] = intervention;
            return ToResponse(intervention);
        }
    }

    public InterventionResponse RecordDecision(Guid interventionId, DecisionRequest request)
    {
        lock (_gate)
        {
            if (!_interventions.TryGetValue(interventionId, out var intervention))
                throw new KeyNotFoundException("Intervention not found.");
            if (!Enum.TryParse<DecisionChoice>(request.Choice, true, out var choice))
                throw new ArgumentException("Unknown decision choice.");
            intervention = intervention with { Choice = choice };
            _interventions[interventionId] = intervention;
            return ToResponse(intervention);
        }
    }

    private MarketQuote Quote(string symbol) =>
        _quotes.TryGetValue(symbol, out var quote)
            ? quote
            : throw new KeyNotFoundException("Asset not found.");

    private static Horizon? ParseHorizon(string? value) =>
        value?.ToLowerInvariant() switch
        {
            "short" => Horizon.Short,
            "medium" => Horizon.Medium,
            "long" => Horizon.Long,
            _ => null
        };

    private static string Display(ExperienceLevel value) => value switch
    {
        ExperienceLevel.Beginner => "Principiante",
        ExperienceLevel.Intermediate => "Intermedio",
        _ => "Experimentado"
    };

    private static string Display(RiskTolerance value) => value switch
    {
        RiskTolerance.Conservative => "Conservadora",
        RiskTolerance.Moderate => "Moderada",
        _ => "Alta"
    };

    private static string Display(Horizon value) => value switch
    {
        Horizon.Short => "Corto",
        Horizon.Medium => "Medio",
        _ => "Largo"
    };

    private static string Display(InvestmentObjective value) => value switch
    {
        InvestmentObjective.Learn => "Aprender",
        InvestmentObjective.Preserve => "Preservar",
        InvestmentObjective.Grow => "Crecer",
        _ => "Explorar"
    };

    private static string RiskBand(int score) =>
        score < 35 ? "Bajo" : score < 65 ? "Medio" : "Alto";

    private static PositionResponse ToResponse(Position position, MarketQuote quote) =>
        new(position.Symbol, position.Quantity, position.AveragePrice, quote.Price, position.ReturnPercent(quote.Price));

    private static InterventionResponse ToResponse(DecisionIntervention item) =>
        new(item.Id, item.Symbol, item.CurrentLossPercent, item.UrgencyScore,
            item.Explanation, item.Alternatives.Select(value => value.ToString()).ToArray(), item.Choice?.ToString());
}
