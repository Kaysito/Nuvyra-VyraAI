using Microsoft.Extensions.DependencyInjection;
using Nuvyra.Application;

namespace Nuvyra.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddNuvyraInfrastructure(this IServiceCollection services) => services.AddSingleton<INuvyraDemoService, NuvyraDemoService>();
}
