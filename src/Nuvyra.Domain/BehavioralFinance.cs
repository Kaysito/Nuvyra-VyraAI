namespace Nuvyra.Domain;

public enum ExperienceLevel { Beginner, Intermediate, Advanced }
public enum RiskTolerance { Conservative, Moderate, High }
public enum Horizon { Short, Medium, Long }
public enum InvestmentObjective { Learn, Preserve, Grow, Explore }
public enum DecisionChoice { Wait24Hours, ReviewEvidence, ContinueSale }
public enum BehaviorSignalType { Fomo, PanicSelling }
public enum SignalLevel { Low, Medium, High }

public sealed record InvestorProfile(
    Guid Id,
    ExperienceLevel Experience,
    RiskTolerance RiskTolerance,
    Horizon Horizon,
    InvestmentObjective Objective,
    int BehavioralRiskScore,
    int Clarity,
    DateTimeOffset CreatedAt);

public sealed record MarketQuote(string Symbol, string Name, decimal Price, decimal Change24Hours, int VolatilityScore);

public sealed record Position(string Symbol, decimal Quantity, decimal AveragePrice)
{
    public decimal ReturnPercent(decimal currentPrice) => AveragePrice == 0 ? 0 : ((currentPrice - AveragePrice) / AveragePrice) * 100;
}

public sealed class VirtualPortfolio
{
    private readonly List<Position> _positions = [];
    public VirtualPortfolio(decimal initialCash) => Cash = initialCash;
    public decimal Cash { get; private set; }
    public IReadOnlyCollection<Position> Positions => _positions.AsReadOnly();

    public Position Buy(string symbol, decimal amount, decimal price)
    {
        if (amount <= 0 || price <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
        if (amount > Cash) throw new InvalidOperationException("Insufficient virtual cash.");
        var quantity = amount / price;
        var existing = _positions.SingleOrDefault(position => position.Symbol == symbol);
        var updated = existing is null
            ? new Position(symbol, quantity, price)
            : new Position(symbol, existing.Quantity + quantity,
                ((existing.Quantity * existing.AveragePrice) + amount) / (existing.Quantity + quantity));
        if (existing is not null) _positions.Remove(existing);
        _positions.Add(updated);
        Cash -= amount;
        return updated;
    }
}

public sealed record DecisionIntervention(
    Guid Id,
    string Symbol,
    decimal CurrentLossPercent,
    int UrgencyScore,
    string Explanation,
    IReadOnlyCollection<DecisionChoice> Alternatives,
    DateTimeOffset CreatedAt,
    DecisionChoice? Choice = null);

public sealed record PulseAnswer(string Value);

public sealed record PulseAssessment(
    ExperienceLevel Experience,
    RiskTolerance Tolerance,
    Horizon Horizon,
    InvestmentObjective Objective,
    int BehavioralRisk,
    int Clarity);

public sealed record BehaviorSignal(
    string Id,
    BehaviorSignalType Type,
    SignalLevel Level,
    string Message,
    IReadOnlyCollection<string> Metrics,
    string RecommendedAction);

public sealed record DecisionContext(
    decimal RecentRisePercent = 0,
    decimal PortfolioConcentrationPercent = 0,
    int PlanChanges = 0,
    decimal RecentDropPercent = 0,
    bool CompleteLiquidation = false,
    Horizon? ChosenHorizon = null,
    Horizon? RequestedHorizon = null);

public static class BehavioralFinanceRules
{
    public static PulseAssessment Assess(IReadOnlyList<string>? answers)
    {
        if (answers is null || answers.Count != 5 || answers.Any(string.IsNullOrWhiteSpace))
            throw new ArgumentException("The pulse requires exactly five completed answers.", nameof(answers));

        var experience = answers[0] switch
        {
            "beginner" => ExperienceLevel.Beginner,
            "intermediate" => ExperienceLevel.Intermediate,
            "experienced" => ExperienceLevel.Advanced,
            _ => throw new ArgumentException("Unknown experience answer.", nameof(answers))
        };

        var reactionScore = answers[1] switch
        {
            "sell" => 80,
            "review" => 40,
            "hold" => 20,
            _ => throw new ArgumentException("Unknown loss-reaction answer.", nameof(answers))
        };

        var horizon = answers[2] switch
        {
            "short" => Horizon.Short,
            "medium" => Horizon.Medium,
            "long" => Horizon.Long,
            _ => throw new ArgumentException("Unknown horizon answer.", nameof(answers))
        };

        var objective = answers[3] switch
        {
            "learn" => InvestmentObjective.Learn,
            "preserve" => InvestmentObjective.Preserve,
            "grow" => InvestmentObjective.Grow,
            "explore" => InvestmentObjective.Explore,
            _ => throw new ArgumentException("Unknown objective answer.", nameof(answers))
        };

        var uncertaintyScore = answers[4] switch
        {
            "low" => 20,
            "medium" => 50,
            "high" => 80,
            _ => throw new ArgumentException("Unknown uncertainty answer.", nameof(answers))
        };

        var horizonScore = horizon switch
        {
            Horizon.Short => 70,
            Horizon.Medium => 45,
            Horizon.Long => 20,
            _ => 45
        };

        var experienceAdjustment = experience == ExperienceLevel.Beginner ? 10 : 0;
        var objectiveAdjustment = objective == InvestmentObjective.Explore ? 5 : 0;

        var behavioralRisk = RoundToFive(
            reactionScore * 0.45m +
            uncertaintyScore * 0.30m +
            horizonScore * 0.15m +
            experienceAdjustment +
            objectiveAdjustment);

        var toleranceScore = RoundToFive(reactionScore * 0.5m + uncertaintyScore * 0.5m);
        var tolerance = toleranceScore < 40
            ? RiskTolerance.Conservative
            : toleranceScore < 70 ? RiskTolerance.Moderate : RiskTolerance.High;

        return new(
            experience,
            tolerance,
            horizon,
            objective,
            behavioralRisk,
            100);
    }

    public static int ClarityForAnswers(IReadOnlyList<string>? answers)
    {
        if (answers is null || answers.Count == 0) return 0;
        var valid = answers.Take(5).Count(answer => !string.IsNullOrWhiteSpace(answer));
        return RoundToFive(valid * 20);
    }

    public static BehaviorSignal? DetectFomo(DecisionContext context)
    {
        var triggers = 0;
        if (context.RecentRisePercent >= 10) triggers++;
        if (context.PortfolioConcentrationPercent >= 35) triggers++;
        if (context.PlanChanges >= 2) triggers++;
        return triggers switch
        {
            0 => null,
            1 => CreateFomo(SignalLevel.Low, triggers),
            2 => CreateFomo(SignalLevel.Medium, triggers),
            _ => CreateFomo(SignalLevel.High, triggers)
        };
    }

    public static BehaviorSignal? DetectPanicSelling(DecisionContext context)
    {
        var triggers = 0;
        if (context.RecentDropPercent >= 15) triggers++;
        if (context.CompleteLiquidation) triggers++;
        if (context.ChosenHorizon.HasValue && context.RequestedHorizon.HasValue &&
            context.ChosenHorizon != context.RequestedHorizon) triggers++;

        return triggers switch
        {
            0 => null,
            1 => CreatePanic(SignalLevel.Low, triggers),
            2 => CreatePanic(SignalLevel.Medium, triggers),
            _ => CreatePanic(SignalLevel.High, triggers)
        };
    }

    public static bool ShouldIntervene(SignalLevel level) => level is SignalLevel.Medium or SignalLevel.High;

    private static BehaviorSignal CreateFomo(SignalLevel level, int triggers) =>
        new("signal.fomo", BehaviorSignalType.Fomo, level,
            "La decisión coincide con señales observables de una compra después de un movimiento rápido. Revisa el plan antes de continuar.",
            [$"señales activas: {triggers}", "subida reciente", "concentración", "cambios de plan"],
            "Compara la compra con tu objetivo, horizonte y concentración antes de confirmar.");

    private static BehaviorSignal CreatePanic(SignalLevel level, int triggers) =>
        new("signal.panic-selling", BehaviorSignalType.PanicSelling, level,
            "La venta coincide con señales observables de una caída brusca o una salida que cambia el plan. Revisa el contexto antes de continuar.",
            [$"señales activas: {triggers}", "caída reciente", "liquidación", "horizonte elegido"],
            "Revisa el movimiento, tu horizonte y la razón original de la posición; después decide si continúas.");

    private static int RoundToFive(decimal value) =>
        Math.Clamp((int)(Math.Round(value / 5m, MidpointRounding.AwayFromZero) * 5), 0, 100);
}
