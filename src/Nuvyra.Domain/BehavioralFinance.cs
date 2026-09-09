namespace Nuvyra.Domain;

public enum ExperienceLevel { Beginner, Intermediate, Advanced }
public enum RiskTolerance { Conservative, Moderate, Aggressive }
public enum DecisionChoice { Wait24Hours, ReviewEvidence, ContinueSale }

public sealed record InvestorProfile(Guid Id, ExperienceLevel Experience, RiskTolerance RiskTolerance, int BehavioralRiskScore, DateTimeOffset CreatedAt);
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

public sealed record DecisionIntervention(Guid Id, string Symbol, decimal CurrentLossPercent, int UrgencyScore,
    string Explanation, IReadOnlyCollection<DecisionChoice> Alternatives, DateTimeOffset CreatedAt, DecisionChoice? Choice = null);
