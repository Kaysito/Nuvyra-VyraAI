using Nuvyra.Contracts;

namespace Nuvyra.Application;

public interface INuvyraDemoService
{
    ProfileResponse Assess(ProfileAssessmentRequest request);
    IReadOnlyCollection<QuoteResponse> GetQuotes();
    PositionResponse Buy(BuyOrderRequest request);
    PositionResponse Sell(SellOrderRequest request);
    PortfolioResponse GetPortfolio();
    InterventionResponse BeforeSell(BeforeSellRequest request);
    InterventionResponse RecordDecision(Guid interventionId, DecisionRequest request);
    void SimulateCrash();
    void ResetDemo();
    LessonResponse GetLesson(string id);
}
