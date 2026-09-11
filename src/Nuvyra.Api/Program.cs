using Nuvyra.Application;
using Nuvyra.Contracts;
using Nuvyra.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddNuvyraInfrastructure(builder.Configuration);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();

app.UseExceptionHandler(error => error.Run(async context =>
{
    var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
    context.Response.StatusCode = exception switch
    {
        KeyNotFoundException => StatusCodes.Status404NotFound,
        ArgumentException or ArgumentOutOfRangeException => StatusCodes.Status400BadRequest,
        InvalidOperationException => StatusCodes.Status409Conflict,
        _ => StatusCodes.Status500InternalServerError
    };
    context.Response.ContentType = "application/json";
    await context.Response.WriteAsJsonAsync(new ApiErrorResponse(
        exception switch { KeyNotFoundException => "not_found", ArgumentException or ArgumentOutOfRangeException => "validation_error", InvalidOperationException => "business_rule", _ => "internal_error" },
        context.Response.StatusCode >= 500 ? "The request could not be completed." : exception?.Message ?? "The request could not be completed.",
        context.TraceIdentifier));
}));
app.UseCors();
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", product = "Nuvyra", heritage = "KairosAI" }));
app.MapGet("/api/market/quotes", async (ILiveMarketDataProvider provider, CancellationToken cancellationToken) =>
{
    var quotes = await provider.GetQuotesAsync(cancellationToken);
    return quotes.Select(quote => new QuoteResponse(
        quote.Symbol,
        quote.Name,
        quote.Price,
        quote.Change24Hours,
        quote.VolatilityScore,
        quote.AsOf ?? DateTimeOffset.UtcNow,
        quote.Source));
});
app.MapGet("/api/learning/lessons/{id}", (string id, INuvyraDemoService service) => service.GetLesson(id));
app.MapGet("/api/learn/lessons", (INuvyraDemoService service) => service.GetLessons());
app.MapGet("/api/learn/course", (INuvyraDemoService service) => service.GetCourse());
app.MapPost("/api/profiles/assessment", (ProfileAssessmentRequest request, INuvyraDemoService service) => Results.Ok(service.Assess(request)));
app.MapGet("/api/profiles/pulse", (INuvyraDemoService service) => service.GetPulseQuestions());
app.MapGet("/api/sandbox/portfolio", (INuvyraDemoService service) => service.GetPortfolio());
app.MapPost("/api/sandbox/orders", (BuyOrderRequest request, INuvyraDemoService service) => Results.Ok(service.Buy(request)));
app.MapPost("/api/sandbox/orders/sell", (SellOrderRequest request, INuvyraDemoService service) => Results.Ok(service.Sell(request)));
app.MapPost("/api/demo/crash", (INuvyraDemoService service) => { service.SimulateCrash(); return Results.NoContent(); });
app.MapPost("/api/demo/reset", (INuvyraDemoService service) => { service.ResetDemo(); return Results.NoContent(); });
app.MapPost("/api/decisions/before-sell", (BeforeSellRequest request, INuvyraDemoService service) => Results.Ok(service.BeforeSell(request)));
app.MapPost("/api/decisions/{id:guid}/choice", (Guid id, DecisionRequest request, INuvyraDemoService service) => Results.Ok(service.RecordDecision(id, request)));
app.MapGet("/api/sandbox/signals", (INuvyraDemoService service) => service.GetBehavioralSignals());
app.Run();

public partial class Program;
