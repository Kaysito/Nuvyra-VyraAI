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
    private bool _crashActive;

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
        ArgumentNullException.ThrowIfNull(request);
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
        ArgumentNullException.ThrowIfNull(request);
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
        {
            if (_crashActive) return;
            _marketData.SimulateCrash();
            _crashActive = true;
        }
    }

    public void ResetDemo()
    {
        lock (_gate)
        {
            _portfolio.Reset();
            _interventions.Clear();
            _signals.Clear();
            _marketData.Reset();
            _crashActive = false;
        }
    }

    public LessonResponse GetLesson(string id)
    {
        var lesson = LearningContent.Lessons.FirstOrDefault(l =>
            l.Id.Equals(id, StringComparison.OrdinalIgnoreCase) ||
            l.Id.Replace("lesson.", "").Equals(id, StringComparison.OrdinalIgnoreCase))
            ?? throw new KeyNotFoundException("Lesson not found.");
        return new(lesson.Id, lesson.Title, lesson.Objective, lesson.EstimatedMinutes);
    }

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
            var currentValue = position.Quantity * quote.Price;
            var costBasis = position.Quantity * position.AveragePrice;
            var profitLoss = currentValue - costBasis;
            var observedSignals = new List<string>();
            if (quote.Change24Hours <= -10) observedSignals.Add("sharpDrop");
            if (loss < 0) observedSignals.Add("positionAtLoss");
            observedSignals.Add("fullLiquidationIntent");
            var scenarios = new DecisionScenario[]
            {
                new("sellAll", "Vender todo", Money(currentValue), 0m, Money(profitLoss),
                    "Convierte toda la posición en efectivo y reconoce el resultado virtual acumulado."),
                new("sellHalf", "Vender 50 %", Money(currentValue / 2m), Money(currentValue / 2m), Money(profitLoss / 2m),
                    "Reduce la exposición y conserva la mitad de la posición virtual."),
                new("hold", "Mantener", 0m, Money(currentValue), 0m,
                    "No genera efectivo ni reconoce la pérdida; conserva toda la exposición al mercado.")
            };
            var intervention = new DecisionIntervention(Guid.NewGuid(), quote.Symbol, loss,
                "El mercado cayó con fuerza. Antes de vender, separa el movimiento del mercado de tu plan original. Nuvyra no bloquea tu decisión: te ayuda a verla con perspectiva.",
                observedSignals, scenarios,
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
    private static decimal Money(decimal value) => decimal.Round(value, 2, MidpointRounding.AwayFromZero);
    private static bool TryParseCode<T>(string? value, out T result) where T : struct, Enum
    {
        result = default;
        return !string.IsNullOrWhiteSpace(value)
            && !int.TryParse(value, out _)
            && Enum.TryParse(value, true, out result)
            && Enum.IsDefined(result);
    }
    private static PositionResponse ToResponse(Position position, MarketQuote quote) => new(position.Symbol, position.Quantity, position.AveragePrice, quote.Price, position.ReturnPercent(quote.Price));
    private static InterventionResponse ToResponse(DecisionIntervention item) => new(
        item.Id,
        item.Symbol,
        item.CurrentLossPercent,
        item.Explanation,
        item.ObservedSignals,
        item.Scenarios.Select(value => new DecisionScenarioResponse(value.Code, value.Label, value.CashReleased,
            value.RemainingExposure, value.ProfitLossRecognized, value.Context)).ToArray(),
        item.Alternatives.Select(value => value.ToString()).ToArray(),
        item.Choice?.ToString(),
        item.CreatedAt);
}
