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
    ("Sandbox crash is idempotent until reset", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var initial = service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price;
        service.SimulateCrash();
        var afterFirst = service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price;
        service.SimulateCrash();
        var afterSecond = service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price;
        Ensure(afterFirst == initial * 0.72m && afterSecond == afterFirst, "Repeated crash must not compound the simulation.");
        service.ResetDemo();
        Ensure(service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price == initial, "Reset must restore market data.");
    }),
    ("Sandbox buy merges symbols case-insensitively", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        service.Buy(new("btc", 100m));
        service.Buy(new("BTC", 100m));
        var portfolio = service.GetPortfolio();
        Ensure(portfolio.Positions.Count == 1 && portfolio.Positions.Single().Quantity > 0, "Equivalent symbols should share one position.");
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
