namespace Nuvyra.Contracts;

public sealed record ProfileAssessmentRequest(string Experience, string RiskDisposition, string Horizon, string Objective, string PressureResponse);
public sealed record ProfileResponse(Guid Id, string Experience, string RiskDisposition, string Horizon, string Objective, string PressureResponse, bool IsProvisional, string AssessmentVersion, DateTimeOffset CreatedAt);
public sealed record BuyOrderRequest(string Symbol, decimal Amount);
public sealed record SellOrderRequest(string Symbol, decimal Amount);
public sealed record PositionResponse(string Symbol, decimal Quantity, decimal AveragePrice, decimal CurrentPrice, decimal ReturnPercent);
public sealed record PortfolioResponse(decimal Cash, decimal TotalValue, IReadOnlyCollection<PositionResponse> Positions);
public sealed record QuoteResponse(string Symbol, string Name, decimal Price, decimal Change24Hours, int VolatilityScore, DateTimeOffset AsOf, string Source);
public sealed record LessonResponse(string Id, string Title, string Summary, int EstimatedMinutes);
public sealed record PulseOptionContract(string Text, string Value, string Dimension, string Explanation);
public sealed record PulseQuestionContract(string Id, string Text, string Dimension, IReadOnlyCollection<PulseOptionContract> Options);
public sealed record LessonContract(string Id, string Title, string Objective, string Scenario, string Explanation, string Question, IReadOnlyCollection<string> Options, IReadOnlyCollection<string> Feedback, string KeyLearning, int EstimatedMinutes, string CompletionAction);
public sealed record CourseModuleContract(string Id, string Name, string Objective, string LessonId, string CompletionCriterion, string SandboxAction);
public sealed record BeforeSellRequest(string Symbol);
public sealed record InterventionResponse(Guid Id, string Symbol, decimal CurrentLossPercent, int UrgencyScore, string Explanation, IReadOnlyCollection<string> Alternatives, string? Choice);
public sealed record DecisionRequest(string Choice);
public sealed record BehavioralSignalResponse(string Type, string Symbol, string Explanation, DateTimeOffset ObservedAt);
public sealed record ApiErrorResponse(string Code, string Message, string TraceId, IReadOnlyDictionary<string, string[]>? Errors = null);
