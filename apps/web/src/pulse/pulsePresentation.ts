import type {
  Experience,
  Horizon,
  Objective,
  PressureResponse,
  RiskDisposition,
} from "./pulseModel";

const EXPERIENCE_LABELS: Record<Experience, string> = {
  beginner: "Inicial",
  intermediate: "Intermedia",
  advanced: "Avanzada",
};

const RISK_DISPOSITION_LABELS: Record<RiskDisposition, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const HORIZON_LABELS: Record<Horizon, string> = {
  short: "Corto plazo",
  medium: "Mediano plazo",
  long: "Largo plazo",
  unspecified: "Sin definir",
};

const OBJECTIVE_LABELS: Record<Objective, string> = {
  preservation: "Conservación",
  growth: "Crecimiento",
  income: "Ingresos periódicos",
  unspecified: "Sin definir",
};

const PRESSURE_RESPONSE_LABELS: Record<PressureResponse, string> = {
  actNow: "Tenderías a actuar de inmediato",
  checkThenAct: "Revisarías información y decidirías pronto",
  pauseAndReview: "Prefieres revisar contexto antes de decidir",
  unsure: "Aún no sabes cómo reaccionarías",
};

export const getExperienceLabel = (value: Experience) => EXPERIENCE_LABELS[value];
export const getRiskDispositionLabel = (value: RiskDisposition) => RISK_DISPOSITION_LABELS[value];
export const getHorizonLabel = (value: Horizon) => HORIZON_LABELS[value];
export const getObjectiveLabel = (value: Objective) => OBJECTIVE_LABELS[value];
export const getPressureResponseLabel = (value: PressureResponse) => PRESSURE_RESPONSE_LABELS[value];
