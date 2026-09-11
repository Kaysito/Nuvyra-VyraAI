import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../App";
import { PULSE_QUESTIONS, type PulseAnswers } from "../pulse/pulseModel";

const learningLesson = {
  id: "lesson.volatility",
  title: "Volatilidad no significa fracaso",
  objective: "Distinguir un movimiento de precio de un cambio en el plan.",
  scenario: "Compraste un activo pensando en conservarlo tres años. Esta semana cae 18 %.",
  explanation: "La volatilidad describe qué tan fuerte y rápido se mueve un precio.",
  question: "¿Qué información revisarías primero?",
  options: ["El comentario más reciente en redes", "Mi objetivo, horizonte y motivo de compra", "Solo el porcentaje de caída"],
  feedback: ["Una señal aislada.", "Correcto.", "El porcentaje no basta."],
  keyLearning: "Compara el movimiento con tu plan.",
  estimatedMinutes: 3,
  completionAction: "Revisar el escenario en el sandbox.",
};

const learningCourse = [{
  id: "module.risk",
  name: "Entender el riesgo",
  objective: "Identificar el riesgo.",
  lessonId: "lesson.volatility",
  completionCriterion: "Completar la microlección.",
  sandboxAction: "Registrar una decisión virtual.",
}];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve({
    json: async () => url === "/api/learn/lessons" ? [learningLesson] : learningCourse,
  } as Response)));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const answers: PulseAnswers = {
  experience: "intermediate",
  riskDisposition: "medium",
  horizon: "long",
  objective: "growth",
  pressureResponse: "pauseAndReview",
};

async function completePulse() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /calibrar mi perfil/i }));

  await answerPulse(user);
  return user;
}

async function answerPulse(user: ReturnType<typeof userEvent.setup>) {
  for (const question of PULSE_QUESTIONS) {
    const option = question.options.find(candidate => candidate.value === answers[question.dimension]);
    if (!option) throw new Error(`Missing test option for ${question.dimension}`);
    await user.click(screen.getByRole("button", { name: new RegExp(escapeRegExp(option.label), "i") }));
  }
}

function desktopNavigation() {
  return within(screen.getByRole("navigation", { name: "Navegación principal" }));
}

describe("App", () => {
  it("renders the uncalibrated home without the legacy clarity metric", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /tu dinero merece una perspectiva más clara/i })).toBeInTheDocument();
    expect(screen.getByText("Sin calibrar")).toBeInTheDocument();
    expect(screen.getByText("0 pts")).toBeInTheDocument();
    expect(screen.getByText("Nivel 1")).toBeInTheDocument();
    expect(screen.queryByText(/claridad inicial/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/claridad del perfil/i)).not.toBeInTheDocument();
  });

  it("explains the uncalibrated profile before starting the pulse", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver perfil/i }));

    expect(screen.getByRole("heading", { name: /tu pulso inicial aún está por definirse/i })).toBeInTheDocument();
    expect(screen.getByText(/no asignaremos un puntaje global/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /comenzar mi pulso/i }));
    expect(screen.getByRole("heading", { name: PULSE_QUESTIONS[0].question })).toBeInTheDocument();
  });

  it("completes pulse-v1 and renders all five provisional profile dimensions", async () => {
    render(<App />);
    const user = await completePulse();

    expect(await screen.findByRole("heading", { name: /volatilidad no significa fracaso/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ver perfil/i }));

    expect(screen.getByRole("heading", { name: /una referencia que puedes recalibrar/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Perfil provisional" })).toBeInTheDocument();
    expect(screen.getByText("pulse-v1")).toBeInTheDocument();

    const facts = screen.getByRole("group", { name: "Dimensiones del pulso" });
    const profileFacts = within(facts);
    expect(profileFacts.getByText("Intermedia")).toBeInTheDocument();
    expect(profileFacts.getByText("Media")).toBeInTheDocument();
    expect(profileFacts.getByText("Largo plazo")).toBeInTheDocument();
    expect(profileFacts.getByText("Crecimiento")).toBeInTheDocument();
    expect(profileFacts.getByText("Prefieres revisar contexto antes de decidir")).toBeInTheDocument();
    expect(screen.queryByText(/\/100/)).not.toBeInTheDocument();
  });

  it("allows recalibrating the completed profile", async () => {
    render(<App />);
    const user = await completePulse();
    await user.click(screen.getByRole("button", { name: /ver perfil/i }));
    await user.click(screen.getByRole("button", { name: /recalibrar mi perfil/i }));

    expect(screen.getByRole("heading", { name: PULSE_QUESTIONS[0].question })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  });

  it("does not repeat the Pulse reward after recalibration", async () => {
    render(<App />);
    const user = await completePulse();
    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    expect(screen.getByText("50 pts")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ver perfil/i }));
    await user.click(screen.getByRole("button", { name: /recalibrar mi perfil/i }));
    await answerPulse(user);
    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);

    expect(screen.getByText("50 pts")).toBeInTheDocument();
  });

  it("awards the complete demo journey and advances to level two", async () => {
    render(<App />);
    const user = await completePulse();

    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    await user.click(screen.getByRole("button", { name: /ver lección/i }));
    await user.click(await screen.findByRole("button", { name: learningLesson.options[1] }));
    await user.click(screen.getByRole("button", { name: /practicar este concepto/i }));
    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    expect(screen.getByText("75 pts")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ir al laboratorio/i }));
    await user.click(screen.getByRole("button", { name: /practicar con bitcoin/i }));
    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    expect(screen.getByText("85 pts")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ir al laboratorio/i }));
    await user.click(screen.getByRole("button", { name: /simular caída/i }));
    await user.click(screen.getByRole("button", { name: /antes de vender/i }));
    await user.click(screen.getByRole("button", { name: /esperar 24 horas/i }));
    await user.click(screen.getByRole("button", { name: /antes de vender/i }));
    await user.click(screen.getByRole("button", { name: /revisar contexto/i }));
    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);

    expect(screen.getByText("100 pts")).toBeInTheDocument();
    expect(screen.getByText("Nivel 2")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  }, 15000);

  it("keeps the completed lesson when returning from practice", async () => {
    render(<App />);
    const user = await completePulse();

    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    await user.click(screen.getByRole("button", { name: /ver lección/i }));
    await user.click(await screen.findByRole("button", { name: learningLesson.options[1] }));
    await user.click(screen.getByRole("button", { name: /practicar este concepto/i }));
    await user.click(desktopNavigation().getByRole("button", { name: "Aprende" }));

    expect(await screen.findByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Completado")).toBeInTheDocument();
  });

  it("uses the completed pulse as context in the practice sandbox without a clarity score", async () => {
    render(<App />);
    const user = await completePulse();
    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    await user.click(screen.getByRole("button", { name: /ir al laboratorio/i }));

    expect(screen.getByRole("heading", { name: /practica antes de arriesgar/i })).toBeInTheDocument();
    expect(screen.getByText("REFERENCIA DEL PULSO")).toBeInTheDocument();
    expect(screen.getByText("Intermedia · Largo plazo")).toBeInTheDocument();
    expect(screen.queryByText(/claridad del perfil/i)).not.toBeInTheDocument();
  });

  it("keeps the virtual practice session when moving between practice and portfolio", async () => {
    render(<App />);
    const user = await completePulse();

    await user.click(screen.getAllByRole("button", { name: /nuvyra, inicio/i })[0]);
    await user.click(screen.getByRole("button", { name: /ir al laboratorio/i }));
    await user.click(screen.getByRole("button", { name: /practicar con ethereum/i }));

    expect(screen.getByRole("button", { name: /ethereum en portafolio/i })).toHaveTextContent("En portafolio");
    expect(screen.getByText("$9,000.00")).toBeInTheDocument();

    await user.click(desktopNavigation().getByRole("button", { name: "Portafolio" }));

    expect(screen.getByRole("heading", { name: /tu portafolio virtual/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ethereum en portafolio/i })).toHaveTextContent("En portafolio");
    expect(screen.getByText("$9,000.00")).toBeInTheDocument();
  });
});
