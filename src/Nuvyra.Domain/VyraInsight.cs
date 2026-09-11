namespace Nuvyra.Domain;

public enum InsightIntent { Explore, Buy, Hold, Sell }
public enum InsightEnvironment { Market, Sandbox }
public enum InsightScenario { Baseline, Crash }

public sealed record InsightFactor(string Code, string Message);

public sealed record VyraInsight(
    Guid Id,
    string Title,
    string Observation,
    IReadOnlyCollection<InsightFactor> Factors,
    IReadOnlyCollection<string> ReflectionQuestions,
    IReadOnlyCollection<string> BehavioralSignals,
    string Source,
    string MarketSource,
    DateTimeOffset GeneratedAt);

/// <summary>
/// Inferencia educativa explicable. Cada conclusión procede de reglas visibles;
/// no predice precios, diagnostica emociones ni decide por el usuario.
/// </summary>
public sealed class ContextualInsightEngine
{
    public VyraInsight Analyze(
        MarketQuote quote,
        InsightIntent intent,
        InvestorProfile? profile,
        decimal virtualExposurePercent)
    {
        ArgumentNullException.ThrowIfNull(quote);
        if (virtualExposurePercent is < 0 or > 100)
            throw new ArgumentOutOfRangeException(nameof(virtualExposurePercent), "Virtual exposure must be between 0 and 100.");

        var factors = new List<InsightFactor>();
        var signals = new List<string>();
        var questions = new List<string>();

        if (quote.VolatilityScore >= 80)
        {
            factors.Add(new("high_volatility", $"{quote.Name} presenta volatilidad muy elevada dentro de la referencia de Nuvyra."));
            if (virtualExposurePercent > 0) signals.Add("highVolatilityExposure");
        }
        else if (quote.VolatilityScore >= 65)
        {
            factors.Add(new("elevated_volatility", $"{quote.Name} presenta volatilidad elevada dentro de la referencia de Nuvyra."));
        }

        if (quote.Change24Hours <= -10)
            factors.Add(new("sharp_drop", $"El activo registra una variación de {quote.Change24Hours:0.0}% en el escenario observado."));
        else if (quote.Change24Hours >= 5)
            factors.Add(new("rapid_rise", $"El activo registra una subida de {quote.Change24Hours:0.0}% durante las últimas 24 horas."));
        else
            factors.Add(new("daily_movement", $"La variación de 24 horas es {quote.Change24Hours:0.0}%; un movimiento diario no describe por sí solo el resultado futuro."));

        if (virtualExposurePercent >= 40)
        {
            factors.Add(new("high_concentration", $"El activo representa {virtualExposurePercent:0.#}% del portafolio virtual indicado."));
            signals.Add("highPortfolioConcentration");
            questions.Add("¿Esta concentración coincide con el nivel de riesgo que querías practicar?");
        }

        if (intent == InsightIntent.Sell && quote.Change24Hours <= -10)
        {
            signals.Add("rapidDecisionAfterDrop");
            questions.Add("¿Cambió tu objetivo original o solamente cambió el precio?");
        }

        if (intent == InsightIntent.Buy && quote.Change24Hours >= 5)
        {
            signals.Add("buyingDuringSpike");
            questions.Add("¿Qué evidencia usarías si el precio no estuviera subiendo hoy?");
        }

        if (profile is not null)
        {
            factors.Add(new("profile_context", $"Tu referencia provisional combina horizonte {ProfileLabel(profile.Horizon)} y objetivo {ProfileLabel(profile.Objective)} sin convertirlos en un puntaje."));
            if (intent == InsightIntent.Sell && quote.Change24Hours <= -10 &&
                profile.Horizon == InvestmentHorizon.Long && profile.Objective == InvestmentObjective.Growth)
            {
                signals.Add("planMismatch");
                questions.Add("¿Cómo se relaciona una variación diaria con un horizonte de largo plazo?");
            }
        }
        else
        {
            factors.Add(new("uncalibrated_profile", "Todavía no existe un pulso provisional para contextualizar el horizonte y el objetivo."));
            questions.Add("¿Qué objetivo y plazo tendría esta decisión en un caso real?");
        }

        if (questions.Count == 0)
            questions.Add("¿Qué información adicional necesitarías antes de tomar una decisión?");

        return new(
            Guid.NewGuid(),
            Title(intent, quote.Change24Hours),
            $"VyraAI observó {quote.Name} ({quote.Symbol}) a {quote.Price:C2} con una variación de {quote.Change24Hours:0.0}%.",
            factors,
            questions,
            signals.Distinct(StringComparer.Ordinal).ToArray(),
            "vyra-rules-v0.1",
            quote.Source,
            DateTimeOffset.UtcNow);
    }

    private static string Title(InsightIntent intent, decimal change) => (intent, change) switch
    {
        (InsightIntent.Sell, <= -10) => "Revisa el contexto antes de decidir",
        (InsightIntent.Buy, >= 5) => "Una subida rápida merece contexto",
        (InsightIntent.Hold, _) => "Contrasta el movimiento con tu plan",
        _ => "Una lectura contextual, no una predicción"
    };

    private static string ProfileLabel<T>(T value) where T : struct, Enum => value.ToString() switch
    {
        "Short" => "corto",
        "Medium" => "medio",
        "Long" => "largo",
        "Preservation" => "preservación",
        "Growth" => "crecimiento",
        "Income" => "ingresos",
        _ => "aún no definido"
    };
}
