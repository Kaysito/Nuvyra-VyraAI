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
    IReadOnlyCollection<PulseQuestionContract> GetPulse();
    IReadOnlyCollection<LessonContract> GetLessons();
    IReadOnlyCollection<CourseModuleContract> GetCourse();
    BehaviorSignalContract? CheckBehavior(BehaviorCheckRequest request);
    void SimulateCrash();
}
