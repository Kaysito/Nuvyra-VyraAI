using Nuvyra.Contracts;

namespace Nuvyra.Application;

public interface INuvyraDemoService
{
    ProfileResponse Assess(ProfileAssessmentRequest request);
    IReadOnlyCollection<object> GetQuotes();
    PositionResponse Buy(BuyOrderRequest request);
    PortfolioResponse GetPortfolio();
    InterventionResponse BeforeSell(BeforeSellRequest request);
    InterventionResponse RecordDecision(Guid interventionId, DecisionRequest request);
    void SimulateCrash();
}
