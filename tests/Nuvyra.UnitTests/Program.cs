using Nuvyra.Domain;
using Nuvyra.Contracts;
using Nuvyra.Infrastructure;

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
        try { portfolio.Buy("BTC", 101m, 100_000m); }
        catch (InvalidOperationException) { return; }
        throw new InvalidOperationException("Expected the operation to be rejected.");
    }),
    ("Return exposes a market drop", () =>
    {
        var position = new Position("BTC", 1m, 100m);
        Ensure(position.ReturnPercent(72m) == -28m, "Return percentage is incorrect.");
    }),
    ("Sell restores cash and reduces a position", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        var remaining = portfolio.Sell("BTC", 250m, 100_000m);
        Ensure(portfolio.Cash == 9_250m, "Cash was not restored correctly.");
        Ensure(remaining.Quantity == 0.0075m, "Position quantity was not reduced correctly.");
    }),
    ("Reset restores the original virtual state", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        portfolio.Reset();
        Ensure(portfolio.Cash == 10_000m, "Cash was not reset correctly.");
        Ensure(portfolio.Positions.Count == 0, "Positions were not reset correctly.");
    }),
    ("Sell rejects a quantity larger than the position", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        try { portfolio.Sell("BTC", 1_001m, 100_000m); }
        catch (InvalidOperationException) { return; }
        throw new InvalidOperationException("Expected the sale to be rejected.");
    }),
    ("Sell is case-insensitive and removes an exact liquidation", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("BTC", 1_000m, 100_000m);
        var closed = portfolio.Sell("btc", 1_000m, 100_000m);
        Ensure(closed.Quantity == 0m, "Exact liquidation should return an empty position.");
        Ensure(portfolio.Cash == 10_000m, "Cash should return to the initial balance.");
        Ensure(portfolio.Positions.Count == 0, "Liquidated positions should not remain in the portfolio.");
    }),
    ("Invalid orders are rejected without mutating the portfolio", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        try { portfolio.Buy("BTC", 0m, 100_000m); }
        catch (ArgumentOutOfRangeException) { }
        Ensure(portfolio.Cash == 10_000m, "Rejected orders must not change cash.");
        Ensure(portfolio.Positions.Count == 0, "Rejected orders must not create positions.");
    }),
    ("Reset is idempotent", () =>
    {
        var portfolio = new VirtualPortfolio(10_000m);
        portfolio.Buy("ETH", 500m, 4_000m);
        portfolio.Reset();
        portfolio.Reset();
        Ensure(portfolio.Cash == 10_000m, "Repeated reset should preserve initial cash.");
        Ensure(portfolio.Positions.Count == 0, "Repeated reset should preserve an empty portfolio.");
    }),
    ("Pulse assessment preserves independent provisional dimensions", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var profile = service.Assess(new("beginner", "medium", "long", "growth", "pauseAndReview"));
        Ensure(profile.IsProvisional && profile.AssessmentVersion == "pulse-v1", "Pulse profile metadata is incorrect.");
        Ensure(profile.Experience == "Beginner" && profile.RiskDisposition == "Medium", "Experience and risk must remain independent.");
        Ensure(profile.Horizon == "Long" && profile.Objective == "Growth" && profile.PressureResponse == "PauseAndReview", "Pulse dimensions were not mapped correctly.");
    }),
    ("Pulse assessment rejects numeric and undefined enum codes", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        try { service.Assess(new("1", "medium", "long", "growth", "pauseAndReview")); }
        catch (ArgumentException) { }
        try { service.Assess(new("beginner", "invalid", "long", "growth", "pauseAndReview")); return; }
        catch (ArgumentException) { }
    }),
    ("Pulse questions expose the five contract dimensions", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var questions = service.GetPulseQuestions();
        Ensure(questions.Count == 5, "Pulse must contain five questions.");
        Ensure(questions.Select(question => question.Dimension).SequenceEqual(["experience", "riskDisposition", "horizon", "objective", "pressureResponse"]), "Pulse dimensions are not aligned.");
    }),
    ("Sandbox crash is idempotent until reset", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var initial = service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price;
        service.SimulateCrash();
        var afterFirst = service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price;
        service.SimulateCrash();
        var afterSecond = service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price;
        Ensure(afterFirst == initial * 0.72m && afterSecond == afterFirst, "Repeated crash must not compound the simulation.");
        service.ResetDemo();
        Ensure(service.GetQuotes().Single(quote => quote.Symbol == "BTC").Price == initial, "Reset must restore market data.");
    }),
    ("Sandbox buy merges symbols case-insensitively", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        service.Buy(new("btc", 100m));
        service.Buy(new("BTC", 100m));
        var portfolio = service.GetPortfolio();
        Ensure(portfolio.Positions.Count == 1 && portfolio.Positions.Single().Quantity > 0, "Equivalent symbols should share one position.");
    }),
    ("Course is non-empty and contains modules", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var course = service.GetCourse();
        Ensure(course.Count > 0, "Course must contain at least one module.");
    }),
    ("Course modules have valid lesson references", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var course = service.GetCourse();
        var lessons = service.GetLessons();
        var lessonIds = lessons.Select(l => l.Id).ToHashSet();
        foreach (var module in course)
        {
            Ensure(lessonIds.Contains(module.LessonId), $"Module {module.Id} references missing lesson {module.LessonId}.");
        }
    }),
    ("Lessons have options and feedback", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var lessons = service.GetLessons();
        foreach (var lesson in lessons)
        {
            Ensure(lesson.Options.Count > 0, $"Lesson {lesson.Id} must have at least one option.");
            Ensure(lesson.Feedback.Count > 0, $"Lesson {lesson.Id} must have at least one feedback item.");
            Ensure(lesson.Options.Count == lesson.Feedback.Count, $"Lesson {lesson.Id} options and feedback count must match.");
        }
    }),
    ("Lessons and modules have positive duration", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var lessons = service.GetLessons();
        foreach (var lesson in lessons)
        {
            Ensure(lesson.EstimatedMinutes > 0, $"Lesson {lesson.Id} must have positive estimated minutes.");
        }
    }),
    ("No duplicate IDs across lessons and modules", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var lessons = service.GetLessons();
        var course = service.GetCourse();
        var lessonIds = lessons.Select(l => l.Id).ToList();
        var moduleIds = course.Select(m => m.Id).ToList();
        Ensure(lessonIds.Count == lessonIds.Distinct().Count(), "Duplicate lesson IDs found.");
        Ensure(moduleIds.Count == moduleIds.Distinct().Count(), "Duplicate module IDs found.");
        var allIds = lessonIds.Concat(moduleIds).ToList();
        Ensure(allIds.Count == allIds.Distinct().Count(), "Duplicate IDs found between lessons and modules.");
    }),
    ("Each module has required structure: stable ID, name, objective, lesson reference, completion criterion, practical action", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var course = service.GetCourse();
        foreach (var module in course)
        {
            Ensure(!string.IsNullOrWhiteSpace(module.Id), "Module must have stable ID.");
            Ensure(!string.IsNullOrWhiteSpace(module.Name), "Module must have name.");
            Ensure(!string.IsNullOrWhiteSpace(module.Objective), "Module must have objective.");
            Ensure(!string.IsNullOrWhiteSpace(module.LessonId), "Module must have associated lesson ID.");
            Ensure(!string.IsNullOrWhiteSpace(module.CompletionCriterion), "Module must have completion criterion.");
            Ensure(!string.IsNullOrWhiteSpace(module.SandboxAction), "Module must have practical sandbox action.");
        }
    }),
    ("Course and lessons endpoints return consistent data for the same lesson", () =>
    {
        var service = new NuvyraDemoService(new DemoMarketDataProvider());
        var lessons = service.GetLessons();
        var course = service.GetCourse();
        var lessonIdsFromCourse = course.Select(m => m.LessonId).Distinct().ToList();
        foreach (var lessonId in lessonIdsFromCourse)
        {
            var lessonFromList = lessons.FirstOrDefault(l => l.Id == lessonId);
            if (lessonFromList == null) throw new InvalidOperationException($"Lesson {lessonId} referenced in course not found in lessons list.");
            var lessonFromEndpoint = service.GetLesson(lessonId);
            Ensure(lessonFromEndpoint.Id == lessonFromList.Id, $"Lesson ID mismatch for {lessonId}.");
            Ensure(lessonFromEndpoint.Title == lessonFromList.Title, $"Lesson title mismatch for {lessonId}.");
            Ensure(lessonFromEndpoint.EstimatedMinutes == lessonFromList.EstimatedMinutes, $"Lesson duration mismatch for {lessonId}.");
        }
    })
};

foreach (var check in checks)
{
    check.Run();
    Console.WriteLine($"PASS: {check.Name}");
}

await CheckLiveMarketProvider();
await CheckVyraInsightService();

static void Ensure(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}

static async Task CheckLiveMarketProvider()
{
    const string payload = """
        {
          "bitcoin": { "usd": 70000, "usd_24h_change": 2.5, "last_updated_at": 1711356300 },
          "ethereum": { "usd": 3500, "usd_24h_change": -1.25, "last_updated_at": 1711356300 },
          "solana": { "usd": 180, "usd_24h_change": 4.75, "last_updated_at": 1711356300 }
        }
        """;

    var successHandler = new StubHttpMessageHandler(_ => new HttpResponseMessage(System.Net.HttpStatusCode.OK)
    {
        Content = new StringContent(payload, System.Text.Encoding.UTF8, "application/json")
    });
    var successProvider = new CoinGeckoMarketDataProvider(
        new HttpClient(successHandler) { BaseAddress = new Uri("https://api.coingecko.com/api/v3/") },
        cacheDuration: TimeSpan.FromMinutes(1));

    var first = await successProvider.GetQuotesAsync();
    var second = await successProvider.GetQuotesAsync();
    Ensure(first.Count == 3, "Live provider must map the three supported assets.");
    Ensure(first.Single(quote => quote.Symbol == "BTC").Price == 70_000m, "CoinGecko price was not mapped.");
    Ensure(first.All(quote => quote.Source == "coingecko"), "Live quotes must identify their source.");
    Ensure(successHandler.CallCount == 1 && ReferenceEquals(first, second), "Fresh quotes must be served from cache.");
    Console.WriteLine("PASS: Live market maps CoinGecko and uses the short cache");

    var failureHandler = new StubHttpMessageHandler(_ => new HttpResponseMessage(System.Net.HttpStatusCode.TooManyRequests));
    var fallbackProvider = new CoinGeckoMarketDataProvider(
        new HttpClient(failureHandler) { BaseAddress = new Uri("https://api.coingecko.com/api/v3/") });
    var fallback = await fallbackProvider.GetQuotesAsync();
    Ensure(fallback.Count == 3 && fallback.All(quote => quote.Source == "demo-fallback"),
        "External failures must return clearly identified local data.");
    Console.WriteLine("PASS: Live market falls back safely when CoinGecko is unavailable");
}

static async Task CheckVyraInsightService()
{
    var sandbox = new DemoMarketDataProvider();
    var live = new StaticLiveMarketProvider([
        new("BTC", "Bitcoin", 70_000m, -2m, 72, DateTimeOffset.UtcNow, "coingecko")
    ]);
    var service = new VyraInsightService(live, sandbox, new ContextualInsightEngine());
    var profile = new InsightProfileContext("beginner", "medium", "long", "growth", "pauseAndReview", "pulse-v1");

    var insight = await service.GenerateAsync(new(
        "BTC", "sell", "sandbox", "crash", profile, 45m));
    Ensure(insight.IsEducational && insight.Source == "vyra-rules-v0.1", "VyraAI must identify its educational rule source.");
    Ensure(insight.MarketSource == "sandbox-simulation", "Crash insights must identify simulated market data.");
    Ensure(insight.BehavioralSignals.Contains("rapidDecisionAfterDrop"), "Selling after a crash must expose the observable timing signal.");
    Ensure(insight.BehavioralSignals.Contains("planMismatch"), "A long growth profile must be contrasted with a rapid sale.");
    Ensure(insight.BehavioralSignals.Contains("highPortfolioConcentration"), "High virtual exposure must be visible.");
    Ensure(insight.Factors.All(factor => !factor.Message.Contains("debes", StringComparison.OrdinalIgnoreCase)),
        "VyraAI must not prescribe a user decision.");
    Console.WriteLine("PASS: VyraAI explains a sandbox crash without prescribing a decision");

    var marketInsight = await service.GenerateAsync(new(
        "BTC", "explore", "market", "baseline", null, 0m));
    Ensure(marketInsight.MarketSource == "coingecko", "Market insights must use the live provider source.");
    Ensure(marketInsight.Factors.Any(factor => factor.Code == "uncalibrated_profile"), "Missing profiles must be disclosed.");
    Console.WriteLine("PASS: VyraAI supports live market context without a profile");
}

sealed class StubHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responseFactory) : HttpMessageHandler
{
    public int CallCount { get; private set; }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        CallCount++;
        return Task.FromResult(responseFactory(request));
    }
}

sealed class StaticLiveMarketProvider(IReadOnlyCollection<MarketQuote> quotes) : ILiveMarketDataProvider
{
    public Task<IReadOnlyCollection<MarketQuote>> GetQuotesAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult(quotes);
}
