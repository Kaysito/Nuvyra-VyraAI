namespace Nuvyra.Contracts;

public sealed record ProfileAssessmentRequest(int Knowledge, int Experience, int LossComfort, int Impulsivity);
public sealed record ProfileResponse(Guid Id, string Experience, string RiskTolerance, int BehavioralRiskScore);
public sealed record BuyOrderRequest(string Symbol, decimal Amount);
public sealed record PositionResponse(string Symbol, decimal Quantity, decimal AveragePrice, decimal CurrentPrice, decimal ReturnPercent);
public sealed record PortfolioResponse(decimal Cash, IReadOnlyCollection<PositionResponse> Positions);
public sealed record BeforeSellRequest(string Symbol);
public sealed record InterventionResponse(Guid Id, string Symbol, decimal CurrentLossPercent, int UrgencyScore, string Explanation, IReadOnlyCollection<string> Alternatives, string? Choice);
public sealed record DecisionRequest(string Choice);
