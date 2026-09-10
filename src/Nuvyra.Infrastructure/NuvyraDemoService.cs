using Nuvyra.Application;
using Nuvyra.Contracts;
using Nuvyra.Domain;

namespace Nuvyra.Infrastructure;

public sealed class NuvyraDemoService : INuvyraDemoService
{
    private readonly object _gate = new();
    private readonly VirtualPortfolio _portfolio = new(10_000m);
    private readonly Dictionary<Guid, DecisionIntervention> _interventions = [];
    private readonly List<BehavioralSignal> _signals = [];
    private readonly IMarketDataProvider _marketData;

    public NuvyraDemoService(IMarketDataProvider marketData) => _marketData = marketData;

    public ProfileResponse Assess(ProfileAssessmentRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        if (!TryParseCode(request.Experience, out ExperienceLevel experience) ||
            !TryParseCode(request.RiskDisposition, out RiskDisposition risk) ||
            !TryParseCode(request.Horizon, out InvestmentHorizon horizon) ||
            !TryParseCode(request.Objective, out InvestmentObjective objective) ||
            !TryParseCode(request.PressureResponse, out PressureResponse pressure))
            throw new ArgumentException("Profile values must use the documented pulse-v1 codes.");

        var profile = new InvestorProfile(Guid.NewGuid(), experience, risk, horizon, objective, pressure, true, "pulse-v1", DateTimeOffset.UtcNow);
        return new(profile.Id, profile.Experience.ToString(), profile.RiskDisposition.ToString(), profile.Horizon.ToString(),
            profile.Objective.ToString(), profile.PressureResponse.ToString(), profile.IsProvisional, profile.AssessmentVersion, profile.CreatedAt);
    }

    public IReadOnlyCollection<PulseQuestionContract> GetPulseQuestions() => LearningContent.Pulse;

    public IReadOnlyCollection<QuoteResponse> GetQuotes() => _marketData.GetQuotes().Select(quote => new QuoteResponse(quote.Symbol, quote.Name, quote.Price, quote.Change24Hours, quote.VolatilityScore, quote.AsOf ?? DateTimeOffset.UtcNow, quote.Source)).ToArray();

    public PositionResponse Buy(BuyOrderRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            var response = ToResponse(_portfolio.Buy(quote.Symbol, request.Amount, quote.Price), quote);
            if (quote.Change24Hours >= 5) _signals.Add(new(BehavioralSignalType.BoughtDuringSpike, quote.Symbol,
                "Compra realizada durante una subida rápida; revisa si responde a FOMO o a tu plan.", DateTimeOffset.UtcNow));
            return response;
        }
    }

    public PositionResponse Sell(SellOrderRequest request)
    {
        lock (_gate)
        {
            var quote = Quote(request.Symbol);
            var response = ToResponse(_portfolio.Sell(quote.Symbol, request.Amount, quote.Price), quote);
            if (quote.Change24Hours <= -10) _signals.Add(new(BehavioralSignalType.SoldDuringDrop, quote.Symbol,
                "Venta realizada durante una caída fuerte; compara la decisión con tu objetivo original.", DateTimeOffset.UtcNow));
            return response;
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
            _marketData.SimulateCrash();
    }

    public void ResetDemo()
    {
        lock (_gate)
        {
            _portfolio.Reset();
            _interventions.Clear();
            _signals.Clear();
            _marketData.Reset();
        }
    }

    public LessonResponse GetLesson(string id) => id.Equals("volatility", StringComparison.OrdinalIgnoreCase) || id.Equals("lesson.volatility", StringComparison.OrdinalIgnoreCase)
        ? new("lesson.volatility", "Volatilidad no significa fracaso", "Aprende a separar un movimiento rápido de la calidad de tu plan.", 4)
        : throw new KeyNotFoundException("Lesson not found.");

    public IReadOnlyCollection<LessonContract> GetLessons() => LearningContent.Lessons;
    public IReadOnlyCollection<CourseModuleContract> GetCourse() => LearningContent.Course;

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
            if (choice is DecisionChoice.Wait24Hours or DecisionChoice.ReviewEvidence)
                _signals.Add(new(BehavioralSignalType.PausedBeforeDecision, intervention.Symbol,
                    "Decisión registrada después de revisar contexto antes de vender.", DateTimeOffset.UtcNow));
            return ToResponse(intervention);
        }
    }

    public IReadOnlyCollection<BehavioralSignalResponse> GetBehavioralSignals()
    {
        lock (_gate) return _signals.Select(signal => new BehavioralSignalResponse(signal.Type.ToString(), signal.Symbol, signal.Explanation, signal.ObservedAt)).ToArray();
    }

    private MarketQuote Quote(string symbol) => _marketData.GetQuote(symbol);
    private static bool TryParseCode<T>(string? value, out T result) where T : struct, Enum
    {
        result = default;
        return !string.IsNullOrWhiteSpace(value)
            && !int.TryParse(value, out _)
            && Enum.TryParse(value, true, out result)
            && Enum.IsDefined(result);
    }
    private static PositionResponse ToResponse(Position position, MarketQuote quote) => new(position.Symbol, position.Quantity, position.AveragePrice, quote.Price, position.ReturnPercent(quote.Price));
    private static InterventionResponse ToResponse(DecisionIntervention item) => new(item.Id, item.Symbol, item.CurrentLossPercent, item.UrgencyScore, item.Explanation, item.Alternatives.Select(value => value.ToString()).ToArray(), item.Choice?.ToString());
}
