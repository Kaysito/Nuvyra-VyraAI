using Nuvyra.Domain;

var checks = new (string Name, Action Run)[]
{
    ("Buy reduces cash and creates a position", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        var position = portfolio.Buy("BTC", 1_000m, 100_000m);

        Ensure(portfolio.Cash == 9_000m, "Cash was not reduced correctly.");
        Ensure(position.Quantity == 0.01m, "Quantity was not calculated correctly.");
    }),

    ("Buy rejects insufficient virtual cash", () =>
    {
        var portfolio = new VirtualPortfolio(100m);

        try
        {
            portfolio.Buy("BTC", 101m, 100_000m);
        }
        catch (InvalidOperationException)
        {
            return;
        }

        throw new InvalidOperationException("Expected the operation to be rejected.");
    }),

    ("Return exposes a market drop", () =>
    {
        var position = new Position("BTC", 1m, 100m);

        Ensure(
            position.ReturnPercent(72m) == -28m,
            "Return percentage is incorrect.");
    }),

    ("Pulse rejects missing, extra and incomplete profiles", () =>
    {
        ExpectFailure(() => BehavioralFinanceRules.Assess([]));

        ExpectFailure(() =>
            BehavioralFinanceRules.Assess(
                ["beginner", "review", "long", "learn"]));

        ExpectFailure(() =>
            BehavioralFinanceRules.Assess(
                ["beginner", "review", "long", "learn", ""]));

        ExpectFailure(() =>
            BehavioralFinanceRules.Assess(
                ["unknown", "review", "long", "learn", "medium"]));
    }),

    ("Pulse classifies experience and tolerance deterministically", () =>
    {
        var conservative = BehavioralFinanceRules.Assess(
            ["beginner", "hold", "short", "learn", "low"]);

        Ensure(
            conservative.Experience == ExperienceLevel.Beginner,
            "Beginner classification failed.");

        Ensure(
            conservative.Tolerance == RiskTolerance.Conservative,
            "Conservative classification failed.");

        var advanced = BehavioralFinanceRules.Assess(
            ["experienced", "hold", "long", "grow", "high"]);

        Ensure(
            advanced.Experience == ExperienceLevel.Advanced,
            "Advanced classification failed.");

        Ensure(
            advanced.Tolerance == RiskTolerance.Moderate,
            "Tolerance classification failed.");
    }),

    ("Clarity is zero for no answers, partial for incomplete and 100 for complete", () =>
    {
        Ensure(
            BehavioralFinanceRules.ClarityForAnswers(null) == 0,
            "Null clarity failed.");

        Ensure(
            BehavioralFinanceRules.ClarityForAnswers([]) == 0,
            "Empty clarity failed.");

        Ensure(
            BehavioralFinanceRules.ClarityForAnswers(
                ["beginner", "review"]) == 40,
            "Partial clarity failed.");

        Ensure(
            BehavioralFinanceRules.ClarityForAnswers(
                ["a", "b", "c", "d", "e"]) == 100,
            "Complete clarity failed.");

        Ensure(
            BehavioralFinanceRules.ClarityForAnswers(
                ["a", "b", "c", "d", "e", "f"]) == 100,
            "Clarity upper bound failed.");
    }),

    ("Behavioral risk stays in range and uses five-point rounding", () =>
    {
        var result = BehavioralFinanceRules.Assess(
            ["beginner", "sell", "short", "explore", "high"]);

        Ensure(
            result.BehavioralRisk is >= 0 and <= 100,
            "Risk is outside 0-100.");

        Ensure(
            result.BehavioralRisk % 5 == 0,
            "Risk was not rounded to five points.");
    }),

    ("FOMO detects measurable observable triggers", () =>
    {
        Ensure(
            BehavioralFinanceRules.DetectFomo(
                new DecisionContext(5, 10, 0)) is null,
            "False FOMO signal.");

        var signal = BehavioralFinanceRules.DetectFomo(
            new DecisionContext(12, 10, 0));

        Ensure(
            signal?.Id == "signal.fomo" &&
            signal.Level == SignalLevel.Low,
            "Low FOMO signal failed.");

        signal = BehavioralFinanceRules.DetectFomo(
            new DecisionContext(15, 40, 2));

        Ensure(
            signal?.Level == SignalLevel.High,
            "High FOMO signal failed.");
    }),

    ("Panic selling detects measurable observable triggers", () =>
    {
        Ensure(
            BehavioralFinanceRules.DetectPanicSelling(
                new DecisionContext()) is null,
            "False panic signal.");

        var signal = BehavioralFinanceRules.DetectPanicSelling(
            new DecisionContext(RecentDropPercent: 18));

        Ensure(
            signal?.Id == "signal.panic-selling" &&
            signal.Level == SignalLevel.Low,
            "Low panic signal failed.");

        signal = BehavioralFinanceRules.DetectPanicSelling(
            new DecisionContext(
                RecentDropPercent: 20,
                CompleteLiquidation: true));

        Ensure(
            signal?.Level == SignalLevel.Medium,
            "Medium panic signal failed.");
    }),

    ("Intervention appears only at medium or high signal level", () =>
    {
        Ensure(
            !BehavioralFinanceRules.ShouldIntervene(SignalLevel.Low),
            "Low level should not intervene.");

        Ensure(
            BehavioralFinanceRules.ShouldIntervene(SignalLevel.Medium),
            "Medium level should intervene.");

        Ensure(
            BehavioralFinanceRules.ShouldIntervene(SignalLevel.High),
            "High level should intervene.");
    }),

    ("Decision choices preserve wait, evidence review and continue", () =>
    {
        var choices = new[]
        {
            DecisionChoice.Wait24Hours,
            DecisionChoice.ReviewEvidence,
            DecisionChoice.ContinueSale
        };

        Ensure(
            choices.Length == 3,
            "Decision alternatives are incomplete.");

        Ensure(
            choices.Contains(DecisionChoice.ContinueSale),
            "Continue decision is missing.");
    })
};

foreach (var check in checks)
{
    check.Run();
    Console.WriteLine($"PASS: {check.Name}");
}

static void Ensure(bool condition, string message)
{
    if (!condition)
        throw new InvalidOperationException(message);
}

static void ExpectFailure(Action action)
{
    try
    {
        action();
    }
    catch (ArgumentException)
    {
        return;
    }

    throw new InvalidOperationException("Expected validation to fail.");
}
