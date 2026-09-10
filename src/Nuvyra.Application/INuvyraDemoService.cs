using Nuvyra.Contracts;

namespace Nuvyra.Application;

public interface INuvyraDemoService
{
    ProfileResponse Assess(ProfileAssessmentRequest request);
    IReadOnlyCollection<PulseQuestionContract> GetPulseQuestions();
    IReadOnlyCollection<QuoteResponse> GetQuotes();
    PositionResponse Buy(BuyOrderRequest request);
    PositionResponse Sell(SellOrderRequest request);
    PortfolioResponse GetPortfolio();
    InterventionResponse BeforeSell(BeforeSellRequest request);
    InterventionResponse RecordDecision(Guid interventionId, DecisionRequest request);
    IReadOnlyCollection<BehavioralSignalResponse> GetBehavioralSignals();
    void SimulateCrash();
    void ResetDemo();
    LessonResponse GetLesson(string id);
    IReadOnlyCollection<LessonContract> GetLessons();
    IReadOnlyCollection<CourseModuleContract> GetCourse();
}
