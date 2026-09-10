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
  getLessons: () => request<Lesson[]>("/api/learn/lessons"),
  getCourse: () => request<CourseModule[]>("/api/learn/course"),
  getPortfolio: () => request<unknown>("/api/sandbox/portfolio"),
  assessProfile: (profile: ProfileAssessmentRequest) => request<ProfileResponse>("/api/profiles/assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  }),
};
