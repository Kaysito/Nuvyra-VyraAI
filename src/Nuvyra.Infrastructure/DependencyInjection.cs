using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nuvyra.Application;

namespace Nuvyra.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddNuvyraInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var baseUrl = configuration["MarketData:CoinGecko:BaseUrl"] ?? "https://api.coingecko.com/api/v3/";
        var timeoutSeconds = configuration.GetValue("MarketData:CoinGecko:TimeoutSeconds", 3);
        var cacheSeconds = configuration.GetValue("MarketData:CoinGecko:CacheSeconds", 30);

        services.AddHttpClient("CoinGecko", client =>
        {
            client.BaseAddress = new Uri(baseUrl);
            client.Timeout = TimeSpan.FromSeconds(Math.Clamp(timeoutSeconds, 1, 10));
            client.DefaultRequestHeaders.UserAgent.ParseAdd("Nuvyra/1.0");
        });

        services.AddSingleton<IMarketDataProvider, DemoMarketDataProvider>();
        services.AddSingleton<ILiveMarketDataProvider>(provider => new CoinGeckoMarketDataProvider(
            provider.GetRequiredService<IHttpClientFactory>().CreateClient("CoinGecko"),
            configuration["MarketData:CoinGecko:ApiKey"],
            TimeSpan.FromSeconds(Math.Clamp(cacheSeconds, 5, 300))));
        services.AddSingleton<INuvyraDemoService, NuvyraDemoService>();
        return services;
    }
}
