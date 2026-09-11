using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Nuvyra.Domain;

namespace Nuvyra.Infrastructure;

public interface ILiveMarketDataProvider
{
    Task<IReadOnlyCollection<MarketQuote>> GetQuotesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Proveedor de mercado de solo lectura. Mantiene el sandbox separado y devuelve
/// datos locales identificados cuando CoinGecko no está disponible.
/// </summary>
public sealed class CoinGeckoMarketDataProvider(
    HttpClient httpClient,
    string? apiKey = null,
    TimeSpan? cacheDuration = null) : ILiveMarketDataProvider
{
    private static readonly AssetDefinition[] Assets =
    [
        new("bitcoin", "BTC", "Bitcoin", 72, 112_450m, 2.4m),
        new("ethereum", "ETH", "Ethereum", 79, 4_380m, -1.8m),
        new("solana", "SOL", "Solana", 88, 214m, 5.2m)
    ];

    private readonly SemaphoreSlim _refreshLock = new(1, 1);
    private readonly TimeSpan _cacheDuration = cacheDuration ?? TimeSpan.FromSeconds(30);
    private IReadOnlyCollection<MarketQuote>? _cache;
    private DateTimeOffset _cacheExpiresAt;

    public async Task<IReadOnlyCollection<MarketQuote>> GetQuotesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        if (_cache is not null && now < _cacheExpiresAt)
            return _cache;

        await _refreshLock.WaitAsync(cancellationToken);
        try
        {
            now = DateTimeOffset.UtcNow;
            if (_cache is not null && now < _cacheExpiresAt)
                return _cache;

            try
            {
                using var request = new HttpRequestMessage(
                    HttpMethod.Get,
                    "simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true&precision=full");

                if (!string.IsNullOrWhiteSpace(apiKey))
                    request.Headers.Add("x-cg-demo-api-key", apiKey);

                using var response = await httpClient.SendAsync(request, cancellationToken);
                response.EnsureSuccessStatusCode();
                var payload = await response.Content.ReadFromJsonAsync<Dictionary<string, CoinGeckoPrice>>(
                    cancellationToken: cancellationToken)
                    ?? throw new InvalidOperationException("CoinGecko returned an empty response.");

                var quotes = Assets.Select(asset => ToQuote(asset, payload)).ToArray();
                _cache = quotes;
                _cacheExpiresAt = now.Add(_cacheDuration);
                return quotes;
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                return FallbackOrStale();
            }
            catch (HttpRequestException)
            {
                return FallbackOrStale();
            }
            catch (InvalidOperationException)
            {
                return FallbackOrStale();
            }
            catch (System.Text.Json.JsonException)
            {
                return FallbackOrStale();
            }
        }
        finally
        {
            _refreshLock.Release();
        }
    }

    private IReadOnlyCollection<MarketQuote> FallbackOrStale()
    {
        if (_cache is not null)
            return _cache.Select(quote => quote with { Source = "coingecko-cache" }).ToArray();

        var now = DateTimeOffset.UtcNow;
        return Assets.Select(asset => new MarketQuote(
            asset.Symbol,
            asset.Name,
            asset.FallbackPrice,
            asset.FallbackChange,
            asset.VolatilityScore,
            now,
            "demo-fallback")).ToArray();
    }

    private static MarketQuote ToQuote(AssetDefinition asset, IReadOnlyDictionary<string, CoinGeckoPrice> payload)
    {
        if (!payload.TryGetValue(asset.Id, out var price) || price.Usd <= 0)
            throw new InvalidOperationException($"CoinGecko did not return a valid quote for {asset.Id}.");

        var asOf = price.LastUpdatedAt > 0
            ? DateTimeOffset.FromUnixTimeSeconds(price.LastUpdatedAt)
            : DateTimeOffset.UtcNow;

        return new MarketQuote(
            asset.Symbol,
            asset.Name,
            price.Usd,
            price.Change24Hours,
            asset.VolatilityScore,
            asOf,
            "coingecko");
    }

    private sealed record AssetDefinition(
        string Id,
        string Symbol,
        string Name,
        int VolatilityScore,
        decimal FallbackPrice,
        decimal FallbackChange);

    private sealed record CoinGeckoPrice(
        [property: JsonPropertyName("usd")] decimal Usd,
        [property: JsonPropertyName("usd_24h_change")] decimal Change24Hours,
        [property: JsonPropertyName("last_updated_at")] long LastUpdatedAt);
}
