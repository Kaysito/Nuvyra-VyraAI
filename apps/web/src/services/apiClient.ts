export type ProfileAssessmentRequest = {
  experience: string;
  riskDisposition: string;
  horizon: string;
  objective: string;
  pressureResponse: string;
};

export type ProfileResponse = ProfileAssessmentRequest & {
  id: string;
  isProvisional: boolean;
  assessmentVersion: string;
  createdAt: string;
};

export type QuoteResponse = {
  symbol: string;
  name: string;
  price: number;
  change24Hours: number;
  volatilityScore: number;
  asOf: string;
  source: string;
};

export type DecisionScenarioResponse = {
  code: "sellAll" | "sellHalf" | "hold";
  label: string;
  cashReleased: number;
  remainingExposure: number;
  profitLossRecognized: number;
  context: string;
};

export type InterventionResponse = {
  id: string;
  symbol: string;
  currentLossPercent: number;
  explanation: string;
  observedSignals: string[];
  scenarios: DecisionScenarioResponse[];
  alternatives: string[];
  choice: string | null;
  createdAt: string;
};

export type VyraInsightResponse = {
  id: string;
  title: string;
  observation: string;
  factors: { code: string; message: string }[];
  reflectionQuestions: string[];
  behavioralSignals: string[];
  source: string;
  marketSource: string;
  isEducational: boolean;
  generatedAt: string;
  disclaimer: string;
};

export type VyraInsightRequest = {
  symbol: string;
  intendedAction: "explore" | "buy" | "hold" | "sell";
  environment: "market" | "sandbox";
  scenario: "baseline" | "crash";
  profile: ProfileAssessmentRequest & { assessmentVersion: "pulse-v1" } | null;
  virtualExposurePercent: number;
};

export type Lesson = {
  id: string;
  title: string;
  objective: string;
  scenario: string;
  explanation: string;
  question: string;
  options: string[];
  feedback: string[];
  keyLearning: string;
  estimatedMinutes: number;
  completionAction: string;
};

export type CourseModule = {
  id: string;
  name: string;
  objective: string;
  lessonId: string;
  completionCriterion: string;
  sandboxAction: string;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly traceId?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit, timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { ...init, signal: controller.signal });
    // Lightweight test doubles may omit `ok`; only an explicit false is an HTTP failure.
    if (response.ok === false) {
      let error: { code?: string; message?: string; traceId?: string } = {};
      try { error = await response.json(); } catch { /* keep a safe generic error */ }
      throw new ApiClientError(
        error.message ?? "No pudimos completar la solicitud.",
        response.status,
        error.code,
        error.traceId,
      );
    }
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("La solicitud tardó demasiado. Inténtalo de nuevo.", 408, "timeout");
    }
    throw new ApiClientError("No pudimos conectar con Nuvyra. Puedes continuar con datos demo.", 0, "network_error");
  } finally {
    window.clearTimeout(timeout);
  }
}

export const apiClient = {
  getHealth: () => request<{ status: string; product: string; heritage: string }>("/api/health"),
  getQuotes: () => request<QuoteResponse[]>("/api/market/quotes"),
  getInsight: (context: VyraInsightRequest) => request<VyraInsightResponse>("/api/guide/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
  }),
  getLessons: () => request<Lesson[]>("/api/learn/lessons"),
  getCourse: () => request<CourseModule[]>("/api/learn/course"),
  getPortfolio: () => request<unknown>("/api/sandbox/portfolio"),
  buyVirtual: (symbol: string, amount: number) => request<unknown>("/api/sandbox/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, amount }),
  }),
  simulateCrash: () => request<void>("/api/demo/crash", { method: "POST" }),
  resetDemo: () => request<void>("/api/demo/reset", { method: "POST" }),
  beforeSell: (symbol: string) => request<InterventionResponse>("/api/decisions/before-sell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol }),
  }),
  recordDecision: (id: string, choice: string) => request<InterventionResponse>(`/api/decisions/${id}/choice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choice }),
  }),
  assessProfile: (profile: ProfileAssessmentRequest) => request<ProfileResponse>("/api/profiles/assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  }),
};
