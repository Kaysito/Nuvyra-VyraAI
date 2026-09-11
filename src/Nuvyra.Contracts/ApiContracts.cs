namespace Nuvyra.Contracts;

/// <summary>
/// Flujo Educativo de Nuvyra:
/// 1. Pulso (PulseQuestionContract) -> El usuario responde un test inicial para medir sesgos y perfil.
/// 2. Perfil Provisional (ProfileResponse) -> Se construye un perfil de inversión temporal de forma reactiva.
/// 3. Curso (CourseModuleContract) -> El usuario inicia una ruta de aprendizaje compuesta por módulos específicos.
/// 4. Microlección (LessonContract) -> Se asocia una microlección con escenario, teoría y autoevaluación.
/// 5. Sandbox (PortfolioResponse, Orders) -> El usuario practica ejecutando órdenes y visualizando el impacto.
/// 6. Reflexión (InterventionResponse) -> Antes de vender con pérdidas o pánico, se detona una reflexión guiada.
/// </summary>
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

/// <summary>
/// Contrato de seguimiento para que el frontend mantenga y calcule localmente el progreso del curso sin persistencia aún en backend.
/// Fórmula recomendada de cálculo local:
/// Progreso por Módulo (%) = (Lección completada? ? 50% : 0%) + (Acción práctica en Sandbox realizada? ? 50% : 0%)
/// Progreso General del Curso (%) = (Suma de progresos de todos los módulos del curso) / (Número total de módulos)
/// </summary>
public sealed record ModuleProgressState(
    string ModuleId,
    bool LessonCompleted,
    bool SandboxActionCompleted,
    decimal CompletionPercentage
);

/// <summary>
/// Estado consolidado de progreso local para el frontend.
/// </summary>
public sealed record LocalProgressContract(
    IReadOnlyCollection<ModuleProgressState> ModuleProgress,
    IReadOnlyCollection<string> CompletedLessonIds,
    decimal OverallProgressPercentage
);

public sealed record BeforeSellRequest(string Symbol);
public sealed record DecisionScenarioResponse(string Code, string Label, decimal CashReleased, decimal RemainingExposure, decimal ProfitLossRecognized, string Context);
public sealed record InterventionResponse(Guid Id, string Symbol, decimal CurrentLossPercent, string Explanation, IReadOnlyCollection<string> ObservedSignals, IReadOnlyCollection<DecisionScenarioResponse> Scenarios, IReadOnlyCollection<string> Alternatives, string? Choice, DateTimeOffset CreatedAt);
public sealed record DecisionRequest(string Choice);
public sealed record BehavioralSignalResponse(string Type, string Symbol, string Explanation, DateTimeOffset ObservedAt);
public sealed record InsightProfileContext(string Experience, string RiskDisposition, string Horizon, string Objective, string PressureResponse, string AssessmentVersion);
public sealed record VyraInsightRequest(string Symbol, string IntendedAction, string Environment, string Scenario, InsightProfileContext? Profile, decimal VirtualExposurePercent = 0);
public sealed record InsightFactorResponse(string Code, string Message);
public sealed record VyraInsightResponse(
    Guid Id,
    string Title,
    string Observation,
    IReadOnlyCollection<InsightFactorResponse> Factors,
    IReadOnlyCollection<string> ReflectionQuestions,
    IReadOnlyCollection<string> BehavioralSignals,
    string Source,
    string MarketSource,
    bool IsEducational,
    DateTimeOffset GeneratedAt,
    string Disclaimer);
public sealed record ApiErrorResponse(string Code, string Message, string TraceId, IReadOnlyDictionary<string, string[]>? Errors = null);
