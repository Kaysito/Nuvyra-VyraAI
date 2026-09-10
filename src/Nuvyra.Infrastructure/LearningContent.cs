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
            new("Invierto con frecuencia y conozco los conceptos básicos", "experienced", "experience", "Indica experiencia práctica frecuente.")
        ]),
        new("pulse.loss-reaction", "Si una inversión que tienes baja 20 %, ¿qué harías primero?", "tolerance",
        [
            new("Vendería para evitar perder más", "sell", "tolerance", "Refleja una reacción de menor comodidad ante una caída."),
            new("Revisaría la situación antes de decidir", "review", "tolerance", "Refleja una respuesta intermedia que busca contexto."),
            new("Mantendría la posición si mi plan no ha cambiado", "hold", "tolerance", "Refleja mayor disposición a mantener un plan durante una caída.")
        ]),
        new("pulse.horizon", "¿Cuánto tiempo planeas mantener normalmente una inversión?", "horizon",
        [
            new("Menos de 1 año", "short", "horizon", "Representa un horizonte corto."),
            new("Entre 1 y 5 años", "medium", "horizon", "Representa un horizonte medio."),
            new("Más de 5 años", "long", "horizon", "Representa un horizonte largo.")
        ]),
        new("pulse.objective", "¿Qué te gustaría conseguir principalmente al aprender sobre inversiones?", "objective",
        [
            new("Entender mejor cómo funcionan", "learn", "objective", "Prioriza aprendizaje y comprensión."),
            new("Cuidar lo que ya tengo", "preserve", "objective", "Prioriza preservación como objetivo educativo."),
            new("Buscar crecimiento a largo plazo", "grow", "objective", "Prioriza crecimiento como objetivo educativo."),
            new("Probar diferentes estrategias", "explore", "objective", "Prioriza exploración de estrategias en el entorno educativo.")
        ]),
        new("pulse.uncertainty", "¿Qué tan cómodo te sientes cuando no puedes saber con certeza qué hará una inversión?", "tolerance",
        [
            new("Prefiero evitar mucha incertidumbre", "low", "tolerance", "Indica menor comodidad ante escenarios inciertos."),
            new("Puedo aceptar cierta incertidumbre", "medium", "tolerance", "Indica comodidad intermedia ante escenarios inciertos."),
            new("Me siento cómodo tomando decisiones con incertidumbre", "high", "tolerance", "Indica mayor comodidad ante escenarios inciertos.")
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
            "Completar la pregunta y revisar el escenario en el sandbox.")
    ];

    public static readonly IReadOnlyCollection<CourseModuleContract> Course =
    [
        new("module.risk", "Entender el riesgo", "Identificar que riesgo y pérdida potencial no son lo mismo que fracaso.", "lesson.volatility", "Completar la microlección de volatilidad.", "Registrar una primera decisión virtual y anotar qué dato del escenario la cambió."),
        new("module.volatility", "Leer la volatilidad", "Observar movimientos sin convertir una variación diaria en una conclusión automática.", "lesson.volatility", "Comparar una caída simulada con el horizonte elegido.", "Ejecutar una simulación de caída y revisar el porcentaje de movimiento."),
        new("module.position", "Construir una posición", "Entender cómo el tamaño de una posición cambia su peso dentro del portafolio.", "lesson.volatility", "Crear una posición virtual y observar su concentración.", "Comprar una cantidad virtual y revisar el peso de la posición."),
        new("module.biases", "Reconocer sesgos", "Reconocer señales observables asociadas con FOMO y venta de pánico sin atribuir estados emocionales.", "lesson.volatility", "Identificar al menos una señal observable en un caso simulado.", "Revisar una compra después de una subida o una venta después de una caída."),
        new("module.practice", "Practicar antes de decidir", "Usar contexto, evidencia y horizonte antes de continuar una operación.", "lesson.volatility", "Elegir esperar, revisar evidencia o continuar en una intervención.", "Abrir 'Antes de vender', revisar las métricas y registrar una decisión.")
    ];
}
