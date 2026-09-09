using Nuvyra.Application;
using Nuvyra.Contracts;
using Nuvyra.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddNuvyraInfrastructure();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();

app.UseExceptionHandler(error => error.Run(async context =>
{
    context.Response.StatusCode = StatusCodes.Status400BadRequest;
    await context.Response.WriteAsJsonAsync(new { error = "The request could not be completed." });
}));
app.UseCors();
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", product = "Nuvyra", heritage = "KairosAI" }));
app.MapGet("/api/market/quotes", (INuvyraDemoService service) => service.GetQuotes());
app.MapPost("/api/profiles/assessment", (ProfileAssessmentRequest request, INuvyraDemoService service) => Results.Ok(service.Assess(request)));
app.MapGet("/api/sandbox/portfolio", (INuvyraDemoService service) => service.GetPortfolio());
app.MapPost("/api/sandbox/orders", (BuyOrderRequest request, INuvyraDemoService service) => Results.Ok(service.Buy(request)));
app.MapPost("/api/demo/crash", (INuvyraDemoService service) => { service.SimulateCrash(); return Results.NoContent(); });
app.MapPost("/api/decisions/before-sell", (BeforeSellRequest request, INuvyraDemoService service) => Results.Ok(service.BeforeSell(request)));
app.MapPost("/api/decisions/{id:guid}/choice", (Guid id, DecisionRequest request, INuvyraDemoService service) => Results.Ok(service.RecordDecision(id, request)));
app.Run();

public partial class Program;
