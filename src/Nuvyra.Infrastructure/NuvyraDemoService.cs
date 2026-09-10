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
        var knowledge = Math.Clamp((request.Knowledge + request.Experience) / 2, 0, 10);
        var behavioralRisk = Math.Clamp((10 - request.LossComfort) * 6 + request.Impulsivity * 4, 0, 100);
        var profile = new InvestorProfile(Guid.NewGuid(),
            knowledge < 4 ? ExperienceLevel.Beginner : knowledge < 8 ? ExperienceLevel.Intermediate : ExperienceLevel.Advanced,
            request.LossComfort < 4 ? RiskTolerance.Conservative : request.LossComfort < 8 ? RiskTolerance.Moderate : RiskTolerance.Aggressive,
            behavioralRisk, DateTimeOffset.UtcNow);
        return new(profile.Id, profile.Experience.ToString(), profile.RiskTolerance.ToString(), profile.BehavioralRiskScore);
    }

    public IReadOnlyCollection<QuoteResponse> GetQuotes() => _quotes.Values.Select(quote => new QuoteResponse(quote.Symbol, quote.Name, quote.Price, quote.Change24Hours, quote.VolatilityScore, quote.AsOf ?? DateTimeOffset.UtcNow, quote.Source)).ToArray();

    public PositionResponse Buy(BuyOrderRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            return ToResponse(_portfolio.Buy(quote.Symbol, request.Amount, quote.Price), quote);
        }
    }

    public PositionResponse Sell(SellOrderRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            return ToResponse(_portfolio.Sell(quote.Symbol, request.Amount, quote.Price), quote);
        }
    }

    public PortfolioResponse GetPortfolio()
    {
        lock (_gate)
        {
            var positions = _portfolio.Positions.Select(position => ToResponse(position, Quote(position.Symbol))).ToArray();
            return new(_portfolio.Cash, _portfolio.Cash + positions.Sum(position => position.Quantity * position.CurrentPrice), positions);
        }
    }

    public void SimulateCrash()
    {
        lock (_gate)
            foreach (var symbol in _quotes.Keys.ToArray())
            {
                var quote = _quotes[symbol];
                _quotes[symbol] = quote with { Price = quote.Price * 0.72m, Change24Hours = -28m, VolatilityScore = 96, AsOf = DateTimeOffset.UtcNow };
            }
    }

    public void ResetDemo()
    {
        lock (_gate)
        {
            _portfolio.Reset();
            _interventions.Clear();
            _quotes["BTC"] = new("BTC", "Bitcoin", 112_450m, 2.4m, 72);
            _quotes["ETH"] = new("ETH", "Ethereum", 4_380m, -1.8m, 79);
            _quotes["SOL"] = new("SOL", "Solana", 214m, 5.2m, 88);
        }
    }

    public LessonResponse GetLesson(string id) => id.Equals("volatility", StringComparison.OrdinalIgnoreCase)
        ? new("volatility", "Volatilidad no significa fracaso", "Aprende a separar un movimiento rápido de la calidad de tu plan.", 4)
        : throw new KeyNotFoundException("Lesson not found.");

    public InterventionResponse BeforeSell(BeforeSellRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            var position = _portfolio.Positions.SingleOrDefault(item => item.Symbol.Equals(quote.Symbol, StringComparison.OrdinalIgnoreCase))
                ?? throw new KeyNotFoundException("Position not found.");
            var loss = position.ReturnPercent(quote.Price);
            var urgency = Math.Clamp((int)Math.Abs(Math.Min(loss, 0)) * 2 + quote.VolatilityScore / 2, 0, 100);
            var intervention = new DecisionIntervention(Guid.NewGuid(), quote.Symbol, loss, urgency,
                "El mercado cayó con fuerza. Antes de vender, separa el movimiento del mercado de tu plan original. Nuvyra no bloquea tu decisión: te ayuda a verla con perspectiva.",
                [DecisionChoice.Wait24Hours, DecisionChoice.ReviewEvidence, DecisionChoice.ContinueSale], DateTimeOffset.UtcNow);
            _interventions[intervention.Id] = intervention;
            return ToResponse(intervention);
        }
    }

    public InterventionResponse RecordDecision(Guid interventionId, DecisionRequest request)
    {
        lock (_gate)
        {
            if (!_interventions.TryGetValue(interventionId, out var intervention)) throw new KeyNotFoundException("Intervention not found.");
            if (!Enum.TryParse<DecisionChoice>(request.Choice, true, out var choice)) throw new ArgumentException("Unknown decision choice.");
            intervention = intervention with { Choice = choice };
            _interventions[interventionId] = intervention;
            return ToResponse(intervention);
        }
    }

    private MarketQuote Quote(string symbol) => _quotes.TryGetValue(symbol, out var quote) ? quote : throw new KeyNotFoundException("Asset not found.");
    private static PositionResponse ToResponse(Position position, MarketQuote quote) => new(position.Symbol, position.Quantity, position.AveragePrice, quote.Price, position.ReturnPercent(quote.Price));
    private static InterventionResponse ToResponse(DecisionIntervention item) => new(item.Id, item.Symbol, item.CurrentLossPercent, item.UrgencyScore, item.Explanation, item.Alternatives.Select(value => value.ToString()).ToArray(), item.Choice?.ToString());
}
