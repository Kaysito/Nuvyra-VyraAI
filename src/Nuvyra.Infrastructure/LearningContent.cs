using Nuvyra.Contracts;

namespace Nuvyra.Infrastructure;

internal static class LearningContent
{
    public static readonly IReadOnlyCollection<PulseQuestionContract> Pulse =
    [
        new("pulse.experience", "¿Qué experiencia tienes tomando decisiones de inversión?", "experience",
        [
            new("Nunca he invertido", "beginner", "experience", "Indica un punto de partida inicial."),
            new("He realizado algunas inversiones", "intermediate", "experience", "Indica experiencia práctica ocasional."),
            new("Invierto con frecuencia y conozco los conceptos básicos", "advanced", "experience", "Indica experiencia práctica frecuente.")
        ]),
        new("pulse.risk-disposition", "Si una inversión que tienes baja 20 %, ¿qué harías primero?", "riskDisposition",
        [
            new("Vendería para evitar perder más", "low", "riskDisposition", "Refleja menor disposición a asumir riesgo."),
            new("Revisaría la situación antes de decidir", "medium", "riskDisposition", "Refleja una disposición intermedia al riesgo."),
            new("Mantendría la posición si mi plan no ha cambiado", "high", "riskDisposition", "Refleja mayor disposición a asumir riesgo.")
        ]),
        new("pulse.horizon", "¿Cuánto tiempo planeas mantener normalmente una inversión?", "horizon",
        [
            new("Menos de 1 año", "short", "horizon", "Representa un horizonte corto."),
            new("Entre 1 y 5 años", "medium", "horizon", "Representa un horizonte medio."),
            new("Más de 5 años", "long", "horizon", "Representa un horizonte largo.")
        ]),
        new("pulse.objective", "¿Cuál es tu objetivo principal al invertir?", "objective",
        [
            new("Preservar mi capital", "preservation", "objective", "Prioriza conservar el capital."),
            new("Buscar crecimiento a largo plazo", "growth", "objective", "Prioriza crecimiento del capital."),
            new("Generar ingresos", "income", "objective", "Prioriza ingresos periódicos."),
            new("Todavía no lo tengo claro", "unspecified", "objective", "Indica que el objetivo está por definirse.")
        ]),
        new("pulse.pressure-response", "Ante una caída rápida del mercado, ¿qué harías primero?", "pressureResponse",
        [
            new("Actuaría de inmediato", "actNow", "pressureResponse", "Indica una respuesta de acción urgente."),
            new("Revisaría el contexto y después decidiría", "checkThenAct", "pressureResponse", "Indica una respuesta que busca contexto."),
            new("Pausaría y revisaría mi plan", "pauseAndReview", "pressureResponse", "Indica una respuesta reflexiva."),
            new("No estoy seguro todavía", "unsure", "pressureResponse", "Indica que la respuesta aún está en formación.")
        ])
    ];

    public static readonly IReadOnlyCollection<LessonContract> Lessons =
    [
        new("lesson.volatility", "Volatilidad no significa fracaso",
            "Distinguir un movimiento de precio de un cambio en el plan.",
            "Compraste un activo pensando en conservarlo tres años. Esta semana cae 18 %. El precio cambió rápidamente, pero tu horizonte no necesariamente cambió.",
            "La volatilidad describe qué tan fuerte y rápido se mueve un precio. Una caída aislada no dice por sí sola si el plan sigue siendo válido. Primero compara el movimiento con tu objetivo, horizonte y motivo original.",
            "¿Qué información revisarías primero?",
            ["El comentario más reciente en redes", "Mi objetivo, horizonte y motivo de compra", "Solo el porcentaje de caída"],
            [
                "Una señal de redes puede aumentar la urgencia, pero no sustituye el contexto de tu plan.",
                "Correcto: el plan original aporta contexto antes de reaccionar a un movimiento aislado.",
                "El porcentaje describe el movimiento, pero no explica por sí solo qué significa para tu decisión."
            ],
            "Una caída de precio es un dato; la decisión debe considerar también el plan y el contexto.",
            3,
            "Completar la pregunta y revisar el escenario en el sandbox."),
        new("lesson.diversification", "El riesgo de poner todos los huevos en la misma canasta",
            "Comprender cómo la concentración extrema de activos amplifica la exposición a la volatilidad del mercado.",
            "Tienes el 95% de tu portafolio virtual invertido en un solo activo tecnológico que ha subido mucho, pero hoy experimenta una corrección fuerte del 15%.",
            "Concentrar todo el capital en un único instrumento significa que tu bienestar financiero depende exclusivamente del comportamiento de ese activo específico. Aunque el potencial de crecimiento puede parecer atractivo, la falta de diversificación elimina el amortiguador ante movimientos adversos del mercado.",
            "¿Cuál es el efecto principal de mantener una concentración del 95% en un solo activo frente a una caída imprevista?",
            [
                "Toda la cartera absorbe el impacto de manera directa y proporcional al peso del activo.",
                "El riesgo se neutraliza automáticamente si el activo subió el mes pasado.",
                "Las pérdidas se dividen entre los mercados globales sin afectar tu cuenta."
            ],
            [
                "Correcto. Al estar concentrado, la volatilidad del activo se transfiere íntegramente a tu patrimonio global sin ningún escudo de diversificación.",
                "Incorrecto. El rendimiento pasado no elimina la exposición actual ante caídas repentinas.",
                "Incorrecto. Los mercados externos no absorben las pérdidas de una posición individual concentrada."
            ],
            "La diversificación no elimina el riesgo de mercado, pero evita que un solo evento adverso comprometa la totalidad de tu capital.",
            3,
            "Ejecutar una acción de rebalanceo o diversificación en el sandbox.")
    ];

    public static readonly IReadOnlyCollection<CourseModuleContract> Course =
    [
        new("module.risk", "Entender el riesgo", "Identificar que riesgo y pérdida potencial no son lo mismo que fracaso.", "lesson.volatility", "Completar la microlección de volatilidad.", "Registrar una primera decisión virtual y anotar qué dato del escenario la cambió."),
        new("module.volatility", "Leer la volatilidad", "Observar movimientos sin convertir una variación diaria en una conclusión automática.", "lesson.volatility", "Comparar una caída simulada con el horizonte elegido.", "Ejecutar una simulación de caída y revisar el porcentaje de movimiento."),
        new("module.position", "Construir una posición", "Entender cómo el tamaño de una posición cambia su peso dentro del portafolio.", "lesson.diversification", "Crear una posición virtual y observar su concentración.", "Comprar una cantidad virtual y revisar el peso de la posición."),
        new("module.biases", "Reconocer sesgos", "Reconocer señales observables asociadas con FOMO y venta de pánico sin atribuir estados emocionales.", "lesson.volatility", "Identificar al menos una señal observable en un caso simulado.", "Revisar una compra después de una subida o una venta después de una caída."),
        new("module.practice", "Practicar antes de decidir", "Usar contexto, evidencia y horizonte antes de continuar una operación.", "lesson.volatility", "Elegir esperar, revisar evidencia o continuar en una intervención.", "Abrir 'Antes de vender', revisar las métricas y registrar una decisión.")
    ];
}
