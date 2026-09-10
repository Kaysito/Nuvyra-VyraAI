export type Experience = "beginner" | "intermediate" | "advanced";
export type RiskDisposition = "low" | "medium" | "high";
export type Horizon = "short" | "medium" | "long" | "unspecified";
export type Objective = "preservation" | "growth" | "income" | "unspecified";
export type PressureResponse = "actNow" | "checkThenAct" | "pauseAndReview" | "unsure";

export type PulseDimension = "experience" | "riskDisposition" | "horizon" | "objective" | "pressureResponse";

export interface PulseAnswers {
  experience: Experience;
  riskDisposition: RiskDisposition;
  horizon: Horizon;
  objective: Objective;
  pressureResponse: PressureResponse;
}

export interface PulseProfile extends PulseAnswers {
  isProvisional: true;
  assessmentVersion: typeof PULSE_ASSESSMENT_VERSION;
}

export interface PulseOption<Value extends string = string> {
  value: Value;
  label: string;
}

export interface PulseQuestion {
  id: PulseDimension;
  dimension: PulseDimension;
  question: string;
  options: readonly PulseOption[];
}

export const PULSE_ASSESSMENT_VERSION = "pulse-v1";

export const PULSE_QUESTIONS = [
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
] as const satisfies readonly PulseQuestion[];

export function createPulseProfile(answers: PulseAnswers): PulseProfile {
  return {
    experience: answers.experience,
    riskDisposition: answers.riskDisposition,
    horizon: answers.horizon,
    objective: answers.objective,
    pressureResponse: answers.pressureResponse,
    isProvisional: true,
    assessmentVersion: PULSE_ASSESSMENT_VERSION,
  };
}
