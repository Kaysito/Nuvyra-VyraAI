import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LearnView } from "./LearnView";

const lesson = {
  id: "lesson.volatility",
  title: "Volatilidad no significa fracaso",
  objective: "Distinguir un movimiento de precio de un cambio en el plan.",
  scenario: "Compraste un activo pensando en conservarlo tres años. Esta semana cae 18 %.",
  explanation: "La volatilidad describe qué tan fuerte y rápido se mueve un precio.",
  question: "¿Qué información revisarías primero?",
  options: ["El comentario más reciente en redes", "Mi objetivo, horizonte y motivo de compra", "Solo el porcentaje de caída"],
  feedback: [
    "Una señal de redes puede aumentar la urgencia, pero no sustituye el contexto de tu plan.",
    "Correcto: el plan original aporta contexto antes de reaccionar a un movimiento aislado.",
    "El porcentaje describe el movimiento, pero no explica por sí solo qué significa para tu decisión.",
  ],
  keyLearning: "Una caída de precio es un dato; la decisión debe considerar también el plan y el contexto.",
  estimatedMinutes: 3,
  completionAction: "Completar la pregunta y revisar el escenario en el sandbox.",
};

const modules = [
  {
    id: "module.risk",
    name: "Entender el riesgo",
    objective: "Identificar que riesgo y pérdida potencial no son lo mismo que fracaso.",
    lessonId: "lesson.volatility",
    completionCriterion: "Completar la microlección de volatilidad.",
    sandboxAction: "Registrar una primera decisión virtual.",
  },
  {
    id: "module.volatility",
    name: "Leer la volatilidad",
    objective: "Observar movimientos sin convertir una variación diaria en una conclusión automática.",
    lessonId: "lesson.volatility.advanced",
    completionCriterion: "Comparar una caída simulada con el horizonte elegido.",
    sandboxAction: "Ejecutar una simulación de caída.",
  },
];

function jsonResponse(body: unknown) {
  return Promise.resolve({ json: async () => body } as Response);
}

function mockLearningApi(lessons = [lesson], course = modules) {
  const fetchMock = vi.fn((url: string) =>
    url === "/api/learn/lessons" ? jsonResponse(lessons) : jsonResponse(course),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LearnView", () => {
  it("shows loading while the learning endpoints are pending", () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    render(<LearnView onPractice={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando microlección…");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("loads lesson and course content, supports an accessible answer, feedback and practice", async () => {
    const onPractice = vi.fn();
    const fetchMock = mockLearningApi();
    const user = userEvent.setup();
    render(<LearnView onPractice={onPractice} />);

    expect(await screen.findByRole("heading", { name: "Volatilidad no significa fracaso." })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/learn/lessons", expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/learn/course", expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(screen.getByRole("heading", { name: "Entender el riesgo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Leer la volatilidad" })).toBeInTheDocument();
    expect(screen.getByText("Registrar una primera decisión virtual.")).toBeInTheDocument();

    const practice = screen.getByRole("button", { name: /practicar este concepto/i });
    expect(practice).toBeDisabled();

    const contextual = screen.getByRole("button", { name: lesson.options[1] });
    expect(contextual).toHaveAttribute("type", "button");
    expect(contextual).toHaveAttribute("aria-pressed", "false");
    await user.click(contextual);

    expect(contextual).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Buena perspectiva");
    expect(screen.getByRole("status")).toHaveTextContent(lesson.feedback[1]);
    expect(practice).toBeEnabled();
    expect(screen.getAllByRole("button").every(button => button.getAttribute("type") === "button")).toBe(true);

    await user.click(practice);
    expect(onPractice).toHaveBeenCalledTimes(1);
  });

  it("derives module progress from completed lesson IDs", async () => {
    mockLearningApi();
    render(<LearnView onPractice={vi.fn()} completedLessonIds={new Set([lesson.id])} />);

    expect(await screen.findByText("50%")).toBeInTheDocument();
    expect(screen.getByText("1 de 2 módulos")).toBeInTheDocument();
    expect(screen.getAllByText("Completado")).toHaveLength(1);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("Duración no disponible")).toBeInTheDocument();
  });

  it("reports a lesson completion only once", async () => {
    const onLessonComplete = vi.fn();
    mockLearningApi();
    const user = userEvent.setup();
    render(<LearnView onPractice={vi.fn()} onLessonComplete={onLessonComplete} />);

    await user.click(await screen.findByRole("button", { name: lesson.options[1] }));
    const practice = screen.getByRole("button", { name: /practicar este concepto/i });
    await user.click(practice);
    await user.click(practice);

    expect(onLessonComplete).toHaveBeenCalledTimes(1);
    expect(onLessonComplete).toHaveBeenCalledWith(lesson.id);
  });

  it.each([0, 2])("gives contextual feedback for answer %s", async index => {
    mockLearningApi();
    const user = userEvent.setup();
    render(<LearnView onPractice={vi.fn()} />);

    const option = await screen.findByRole("button", { name: lesson.options[index] });
    await user.click(option);

    expect(screen.getByRole("status")).toHaveTextContent("Miremos un poco más amplio");
    expect(screen.getByRole("status")).toHaveTextContent(lesson.feedback[index]);
  });

  it("shows the required message when learning content cannot be loaded", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    render(<LearnView onPractice={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar el contenido de aprendizaje.");
  });

  it("handles an empty lessons response without breaking", async () => {
    mockLearningApi([]);
    render(<LearnView onPractice={vi.fn()} />);

    expect(await screen.findByRole("status")).toHaveTextContent("No hay microlecciones disponibles.");
    expect(screen.queryByRole("button", { name: /practicar este concepto/i })).not.toBeInTheDocument();
  });

  it("keeps the lesson usable when the course has no modules", async () => {
    mockLearningApi([lesson], []);
    render(<LearnView onPractice={vi.fn()} />);

    expect(await screen.findByRole("heading", { name: "Volatilidad no significa fracaso." })).toBeInTheDocument();
    expect(screen.getByText("0 de 0 módulos")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows a clean empty state when lessons and course are empty", async () => {
    mockLearningApi([], []);
    render(<LearnView onPractice={vi.fn()} />);

    expect(await screen.findByRole("status")).toHaveTextContent("No hay microlecciones disponibles.");
  });
});
