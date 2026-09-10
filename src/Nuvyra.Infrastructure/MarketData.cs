using Nuvyra.Domain;

namespace Nuvyra.Infrastructure;

public interface IMarketDataProvider
{
    IReadOnlyCollection<MarketQuote> GetQuotes();
    MarketQuote GetQuote(string symbol);
    void SimulateCrash();
    void Reset();
}

/// <summary>Fuente local determinista para la demo. Un proveedor externo puede implementarse sin tocar el dominio.</summary>
public sealed class DemoMarketDataProvider : IMarketDataProvider
{
    private readonly object _gate = new();
    private readonly Dictionary<string, MarketQuote> _quotes = new(StringComparer.OrdinalIgnoreCase);

    public DemoMarketDataProvider() => Reset();

    public IReadOnlyCollection<MarketQuote> GetQuotes()
    {
        lock (_gate) return _quotes.Values.ToArray();
    }

    public MarketQuote GetQuote(string symbol)
    {
        lock (_gate) return _quotes.TryGetValue(symbol, out var quote)
            ? quote
            : throw new KeyNotFoundException("Asset not found.");
    }

    public void SimulateCrash()
    {
        lock (_gate)
            foreach (var symbol in _quotes.Keys.ToArray())
            {
                var quote = _quotes[symbol];
                _quotes[symbol] = quote with { Price = quote.Price * 0.72m, Change24Hours = -28m, VolatilityScore = 96, AsOf = DateTimeOffset.UtcNow, Source = "demo" };
            }
    }

    public void Reset()
    {
        lock (_gate)
        {
            _quotes.Clear();
            _quotes["BTC"] = new("BTC", "Bitcoin", 112_450m, 2.4m, 72, DateTimeOffset.UtcNow, "demo");
            _quotes["ETH"] = new("ETH", "Ethereum", 4_380m, -1.8m, 79, DateTimeOffset.UtcNow, "demo");
            _quotes["SOL"] = new("SOL", "Solana", 214m, 5.2m, 88, DateTimeOffset.UtcNow, "demo");
        }
    }
}
