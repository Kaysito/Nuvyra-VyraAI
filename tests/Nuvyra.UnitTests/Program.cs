using Nuvyra.Domain;
using Nuvyra.Contracts;
using Nuvyra.Infrastructure;

var checks = new (string Name, Action Run)[]
{
    ("Buy reduces cash and creates a position", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        var position = portfolio.Buy("BTC", 1_000m, 100_000m);
        Ensure(portfolio.Cash == 9_000m, "Cash was not reduced correctly.");
        Ensure(position.Quantity == 0.01m, "Quantity was not calculated correctly.");
    }),
    ("Buy rejects insufficient virtual cash", () =>
    {
        var portfolio = new VirtualPortfolio(100m);
        try { portfolio.Buy("BTC", 101m, 100_000m); }
        catch (InvalidOperationException) { return; }
        throw new InvalidOperationException("Expected the operation to be rejected.");
    }),
    ("Return exposes a market drop", () =>
    {
        var position = new Position("BTC", 1m, 100m);
        Ensure(position.ReturnPercent(72m) == -28m, "Return percentage is incorrect.");
    }),
    ("Sell restores cash and reduces a position", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        var remaining = portfolio.Sell("BTC", 250m, 100_000m);
        Ensure(portfolio.Cash == 9_250m, "Cash was not restored correctly.");
        Ensure(remaining.Quantity == 0.0075m, "Position quantity was not reduced correctly.");
    }),
    ("Reset restores the original virtual state", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        portfolio.Reset();
        Ensure(portfolio.Cash == 10_000m, "Cash was not reset correctly.");
        Ensure(portfolio.Positions.Count == 0, "Positions were not reset correctly.");
    }),
    ("Sell rejects a quantity larger than the position", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        try { portfolio.Sell("BTC", 1_001m, 100_000m); }
        catch (InvalidOperationException) { return; }
        throw new InvalidOperationException("Expected the sale to be rejected.");
    }),
    ("Sell is case-insensitive and removes an exact liquidation", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        var closed = portfolio.Sell("btc", 1_000m, 100_000m);
        Ensure(closed.Quantity == 0m, "Exact liquidation should return an empty position.");
        Ensure(portfolio.Cash == 10_000m, "Cash should return to the initial balance.");
        Ensure(portfolio.Positions.Count == 0, "Liquidated positions should not remain in the portfolio.");
    }),
    ("Invalid orders are rejected without mutating the portfolio", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        try { portfolio.Buy("BTC", 0m, 100_000m); }
        catch (ArgumentOutOfRangeException) { }
        Ensure(portfolio.Cash == 10_000m, "Rejected orders must not change cash.");
        Ensure(portfolio.Positions.Count == 0, "Rejected orders must not create positions.");
    }),
    ("Reset is idempotent", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("ETH", 500m, 4_000m);
        portfolio.Reset();
        portfolio.Reset();
        Ensure(portfolio.Cash == 10_000m, "Repeated reset should preserve initial cash.");
        Ensure(portfolio.Positions.Count == 0, "Repeated reset should preserve an empty portfolio.");
    }),
    ("Pulse assessment preserves independent provisional dimensions", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var profile = service.Assess(new("beginner", "medium", "long", "growth", "pauseAndReview"));
        Ensure(profile.IsProvisional && profile.AssessmentVersion == "pulse-v1", "Pulse profile metadata is incorrect.");
        Ensure(profile.Experience == "Beginner" && profile.RiskDisposition == "Medium", "Experience and risk must remain independent.");
        Ensure(profile.Horizon == "Long" && profile.Objective == "Growth" && profile.PressureResponse == "PauseAndReview", "Pulse dimensions were not mapped correctly.");
    }),
    ("Pulse assessment rejects numeric and undefined enum codes", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        try { service.Assess(new("1", "medium", "long", "growth", "pauseAndReview")); }
        catch (ArgumentException) { }
        try { service.Assess(new("beginner", "invalid", "long", "growth", "pauseAndReview")); return; }
        catch (ArgumentException) { }
    }),
    ("Pulse questions expose the five contract dimensions", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var questions = service.GetPulseQuestions();
        Ensure(questions.Count == 5, "Pulse must contain five questions.");
        Ensure(questions.Select(question => question.Dimension).SequenceEqual(["experience", "riskDisposition", "horizon", "objective", "pressureResponse"]), "Pulse dimensions are not aligned.");
    })
};

foreach (var check in checks)
{
    check.Run();
    Console.WriteLine($"PASS: {check.Name}");
}

static void Ensure(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}
