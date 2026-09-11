using Nuvyra.Contracts;

namespace Nuvyra.Application;

public interface IVyraInsightService
{
    Task<VyraInsightResponse> GenerateAsync(VyraInsightRequest request, CancellationToken cancellationToken = default);
}
