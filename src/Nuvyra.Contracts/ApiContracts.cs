namespace Nuvyra.Contracts;

public sealed record ProfileAssessmentRequest(IReadOnlyList<string> Answers);
public sealed record ProfileResponse(
    Guid Id,
    string Experience,
    string Tolerance,
    string Horizon,
    string Objective,
    string BehavioralRisk,
    int BehavioralRiskScore,
    int Clarity);

public sealed record PulseOptionContract(string Text, string Value, string Dimension, string Explanation);
public sealed record PulseQuestionContract(string Id, string Text, string Dimension, IReadOnlyCollection<PulseOptionContract> Options);

public sealed record LessonContract(
    string Id,
    string Title,
    string Objective,
    string Scenario,
    string Explanation,
    string Question,
    IReadOnlyCollection<string> Options,
    IReadOnlyCollection<string> Feedback,
    string KeyLearning,
    int EstimatedMinutes,
    string CompletionAction);

public sealed record CourseModuleContract(
    string Id,
    string Name,
    string Objective,
    string LessonId,
    string CompletionCriterion,
    string SandboxAction);

public sealed record BehaviorSignalContract(
    string Id,
    string Type,
    string Level,
    string Message,
    IReadOnlyCollection<string> Metrics,
    string RecommendedAction);

public sealed record InterventionContract(
    string Id,
    string Title,
    string Reason,
    IReadOnlyCollection<string> Metrics,
    IReadOnlyCollection<string> Actions,
    bool AllowsContinue);

public sealed record BuyOrderRequest(string Symbol, decimal Amount);
public sealed record PositionResponse(string Symbol, decimal Quantity, decimal AveragePrice, decimal CurrentPrice, decimal ReturnPercent);
public sealed record PortfolioResponse(decimal Cash, IReadOnlyCollection<PositionResponse> Positions);
public sealed record BeforeSellRequest(string Symbol);
public sealed record InterventionResponse(Guid Id, string Symbol, decimal CurrentLossPercent, int UrgencyScore, string Explanation, IReadOnlyCollection<string> Alternatives, string? Choice);
public sealed record DecisionRequest(string Choice);
public sealed record BehaviorCheckRequest(
    decimal RecentRisePercent = 0,
    decimal PortfolioConcentrationPercent = 0,
    int PlanChanges = 0,
    decimal RecentDropPercent = 0,
    bool CompleteLiquidation = false,
    string? ChosenHorizon = null,
    string? RequestedHorizon = null);
