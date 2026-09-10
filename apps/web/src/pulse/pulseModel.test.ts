import { describe, expect, it } from "vitest";
import {
  createPulseProfile,
  PULSE_ASSESSMENT_VERSION,
  PULSE_QUESTIONS,
  type Experience,
  type Horizon,
  type Objective,
  type PressureResponse,
  type PulseAnswers,
  type RiskDisposition,
} from "./pulseModel";

const expectedQuestions = [
  {
    id: "experience",
    dimension: "experience",
    question: "¿Cuál describe mejor tu experiencia personal con inversiones?",
    options: [
      { value: "beginner", label: "Nunca he invertido." },
      { value: "intermediate", label: "He realizado algunas inversiones o simulaciones y conozco conceptos básicos." },
      { value: "advanced", label: "Invierto o he invertido con regularidad y he vivido tanto subidas como caídas del mercado." },
    ],
  },
  {
    id: "riskDisposition",
    dimension: "riskDisposition",
    question: "Pensando en una inversión de varios años, ¿qué nivel de variación estarías dispuesto a aceptar a cambio de mayor potencial de crecimiento?",
    options: [
      { value: "low", label: "Prefiero variaciones pequeñas aunque el potencial de crecimiento sea menor." },
      { value: "medium", label: "Aceptaría variaciones moderadas buscando mayor crecimiento." },
      { value: "high", label: "Aceptaría variaciones grandes y pérdidas temporales importantes buscando mayor potencial de crecimiento a largo plazo." },
    ],
  },
  {
    id: "horizon",
    dimension: "horizon",
    question: "Si este dinero estuviera destinado a una meta real, ¿cuándo esperarías necesitar la mayor parte?",
    options: [
      { value: "short", label: "En menos de 3 años." },
      { value: "medium", label: "Entre 3 y 7 años." },
      { value: "long", label: "En más de 7 años." },
      { value: "unspecified", label: "Aún no lo tengo definido." },
    ],
  },
  {
    id: "objective",
    dimension: "objective",
    question: "¿Cuál sería el propósito principal de ese dinero?",
    options: [
      { value: "preservation", label: "Conservarlo para una necesidad futura importante." },
      { value: "growth", label: "Hacerlo crecer para una meta futura." },
      { value: "income", label: "Buscar ingresos periódicos." },
      { value: "unspecified", label: "Aún no tengo un objetivo definido." },
    ],
  },
  {
    id: "pressureResponse",
    dimension: "pressureResponse",
    question: "Imagina que un activo que sigues sube o cae muy rápido y empiezas a ver muchas opiniones urgentes en redes. ¿Qué harías primero?",
    options: [
      { value: "actNow", label: "Actuar cuanto antes para no perder la oportunidad o evitar una pérdida mayor." },
      { value: "checkThenAct", label: "Revisar rápidamente información y probablemente decidir ese mismo día." },
      { value: "pauseAndReview", label: "Volver a mi objetivo y revisar evidencia antes de tomar una decisión." },
      { value: "unsure", label: "No sé cómo reaccionaría." },
    ],
  },
] as const;

const experiences: Experience[] = ["beginner", "intermediate", "advanced"];
const riskDispositions: RiskDisposition[] = ["low", "medium", "high"];
const horizons: Horizon[] = ["short", "medium", "long", "unspecified"];
const objectives: Objective[] = ["preservation", "growth", "income", "unspecified"];
const pressureResponses: PressureResponse[] = ["actNow", "checkThenAct", "pauseAndReview", "unsure"];

const validCombinations: PulseAnswers[] = experiences.flatMap(experience =>
  riskDispositions.flatMap(riskDisposition =>
    horizons.flatMap(horizon =>
      objectives.flatMap(objective =>
        pressureResponses.map(pressureResponse => ({
          experience,
          riskDisposition,
          horizon,
          objective,
          pressureResponse,
        })),
      ),
    ),
  ),
);

describe("PULSE_QUESTIONS", () => {
  it("contains exactly five questions", () => {
    expect(PULSE_QUESTIONS).toHaveLength(5);
  });

  it("has unique ids", () => {
    const ids = PULSE_QUESTIONS.map(question => question.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains each dimension exactly once", () => {
    const dimensions = PULSE_QUESTIONS.map(question => question.dimension);

    expect(new Set(dimensions).size).toBe(dimensions.length);
    expect(dimensions).toEqual(["experience", "riskDisposition", "horizon", "objective", "pressureResponse"]);
  });

  it("keeps the agreed question order", () => {
    expect(PULSE_QUESTIONS.map(question => question.id)).toEqual([
      "experience",
      "riskDisposition",
      "horizon",
      "objective",
      "pressureResponse",
    ]);
  });

  it("has the agreed option counts", () => {
    expect(PULSE_QUESTIONS.map(question => question.options.length)).toEqual([3, 3, 4, 4, 4]);
  });

  it("contains the agreed questions and options", () => {
    expect(PULSE_QUESTIONS).toEqual(expectedQuestions);
  });

  it("has no duplicate option values within a question", () => {
    for (const question of PULSE_QUESTIONS) {
      const values = question.options.map(option => option.value);

      expect(new Set(values).size).toBe(values.length);
    }
  });
});

describe("pulse-v1 profile", () => {
  it("generates exactly 576 valid combinations", () => {
    expect(validCombinations).toHaveLength(576);
  });

  it("uses the agreed assessment version", () => {
    expect(PULSE_ASSESSMENT_VERSION).toBe("pulse-v1");
  });

  it("preserves every answer and marks the profile provisional", () => {
    const answers: PulseAnswers = {
      experience: "advanced",
      riskDisposition: "high",
      horizon: "long",
      objective: "growth",
      pressureResponse: "pauseAndReview",
    };

    expect(createPulseProfile(answers)).toEqual({
      ...answers,
      isProvisional: true,
      assessmentVersion: "pulse-v1",
    });
  });

  it("preserves unspecified and unsure answers", () => {
    const profile = createPulseProfile({
      experience: "beginner",
      riskDisposition: "low",
      horizon: "unspecified",
      objective: "unspecified",
      pressureResponse: "unsure",
    });

    expect(profile.horizon).toBe("unspecified");
    expect(profile.objective).toBe("unspecified");
    expect(profile.pressureResponse).toBe("unsure");
  });

  it("does not add scoring or behavioral properties", () => {
    const profile = createPulseProfile({
      experience: "intermediate",
      riskDisposition: "medium",
      horizon: "medium",
      objective: "income",
      pressureResponse: "checkThenAct",
    });

    for (const property of ["clarity", "score", "riskScore", "behavioralRiskScore", "behavioralSignal"]) {
      expect(profile).not.toHaveProperty(property);
    }
  });

  it.each(validCombinations)("preserves all dimensions for %o", answers => {
    const profile = createPulseProfile(answers);

    expect(profile.experience).toBe(answers.experience);
    expect(profile.riskDisposition).toBe(answers.riskDisposition);
    expect(profile.horizon).toBe(answers.horizon);
    expect(profile.objective).toBe(answers.objective);
    expect(profile.pressureResponse).toBe(answers.pressureResponse);
    expect(profile.isProvisional).toBe(true);
    expect(profile.assessmentVersion).toBe("pulse-v1");
  });
});
