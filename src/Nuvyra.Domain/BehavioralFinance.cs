namespace Nuvyra.Domain;

public enum ExperienceLevel { Beginner, Intermediate, Advanced }
public enum RiskDisposition { Low, Medium, High }
public enum DecisionChoice { Wait24Hours, ReviewEvidence, ContinueSale }
public enum InvestmentHorizon { Short, Medium, Long, Unspecified }
public enum InvestmentObjective { Preservation, Growth, Income, Unspecified }
public enum PressureResponse { ActNow, CheckThenAct, PauseAndReview, Unsure }
public enum BehavioralSignalType { BoughtDuringSpike, SoldDuringDrop, PausedBeforeDecision }

public sealed record InvestorProfile(Guid Id, ExperienceLevel Experience, RiskDisposition RiskDisposition,
    InvestmentHorizon Horizon, InvestmentObjective Objective, PressureResponse PressureResponse,
    bool IsProvisional, string AssessmentVersion, DateTimeOffset CreatedAt);
public sealed record MarketQuote(string Symbol, string Name, decimal Price, decimal Change24Hours, int VolatilityScore,
    DateTimeOffset? AsOf = null, string Source = "demo");

public sealed record Position(string Symbol, decimal Quantity, decimal AveragePrice)
{
    public decimal ReturnPercent(decimal currentPrice) => AveragePrice == 0 ? 0 : ((currentPrice - AveragePrice) / AveragePrice) * 100;
}

public sealed class VirtualPortfolio
{
    private readonly List<Position> _positions = [];
    private readonly decimal _initialCash;
    public VirtualPortfolio(decimal initialCash) { if (initialCash < 0) throw new ArgumentOutOfRangeException(nameof(initialCash)); _initialCash = initialCash; Cash = initialCash; }
    public decimal Cash { get; private set; }
    public IReadOnlyCollection<Position> Positions => _positions.AsReadOnly();

    public Position Buy(string symbol, decimal amount, decimal price)
    {
        ValidateOrder(symbol, amount, price);
        if (amount > Cash) throw new InvalidOperationException("Insufficient virtual cash.");
        var quantity = amount / price;
        var existing = _positions.SingleOrDefault(position => position.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase));
        var updated = existing is null
            ? new Position(symbol, quantity, price)
            : new Position(symbol, existing.Quantity + quantity,
                ((existing.Quantity * existing.AveragePrice) + amount) / (existing.Quantity + quantity));
        if (existing is not null) _positions.Remove(existing);
        _positions.Add(updated);
        Cash -= amount;
        return updated;
    }

    public Position Sell(string symbol, decimal amount, decimal price)
    {
        ValidateOrder(symbol, amount, price);
        var existing = _positions.SingleOrDefault(position => position.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase))
            ?? throw new InvalidOperationException("Position not found.");
        var sellQuantity = amount / price;
        if (sellQuantity > existing.Quantity) throw new InvalidOperationException("Insufficient virtual position.");
        var remaining = existing.Quantity - sellQuantity;
        _positions.Remove(existing);
        if (remaining > 0) _positions.Add(new Position(existing.Symbol, remaining, existing.AveragePrice));
        Cash += amount;
        return remaining > 0 ? new Position(existing.Symbol, remaining, existing.AveragePrice) : new Position(existing.Symbol, 0, existing.AveragePrice);
    }

    public void Reset() { _positions.Clear(); Cash = _initialCash; }

    private static void ValidateOrder(string symbol, decimal amount, decimal price)
    {
        if (string.IsNullOrWhiteSpace(symbol)) throw new ArgumentException("Symbol is required.", nameof(symbol));
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount), "Amount must be greater than zero.");
        if (price <= 0) throw new ArgumentOutOfRangeException(nameof(price), "Price must be greater than zero.");
    }
}

public sealed record DecisionScenario(
    string Code,
    string Label,
    decimal CashReleased,
    decimal RemainingExposure,
    decimal ProfitLossRecognized,
    string Context);

public sealed record DecisionIntervention(
    Guid Id,
    string Symbol,
    decimal CurrentLossPercent,
    string Explanation,
    IReadOnlyCollection<string> ObservedSignals,
    IReadOnlyCollection<DecisionScenario> Scenarios,
    IReadOnlyCollection<DecisionChoice> Alternatives,
    DateTimeOffset CreatedAt,
    DecisionChoice? Choice = null);
public sealed record BehavioralSignal(BehavioralSignalType Type, string Symbol, string Explanation, DateTimeOffset ObservedAt);
