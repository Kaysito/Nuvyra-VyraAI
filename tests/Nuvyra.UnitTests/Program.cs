using Nuvyra.Domain;

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
