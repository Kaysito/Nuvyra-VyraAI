import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "./apiClient";

afterEach(() => vi.unstubAllGlobals());

function response(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as Response;
}

describe("apiClient", () => {
  it("requests learning resources with typed paths", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response([{ id: "lesson.volatility" }]))
      .mockResolvedValueOnce(response([{ id: "module.risk" }]));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiClient.getLessons()).resolves.toEqual([{ id: "lesson.volatility" }]);
    await expect(apiClient.getCourse()).resolves.toEqual([{ id: "module.risk" }]);
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/learn/lessons", expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/learn/course", expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it("sends the pulse profile as JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ id: "profile-1", isProvisional: true }));
    vi.stubGlobal("fetch", fetchMock);

    await apiClient.assessProfile({
      experience: "beginner",
      riskDisposition: "medium",
      horizon: "long",
      objective: "growth",
      pressureResponse: "pauseAndReview",
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/profiles/assessment", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience: "beginner",
        riskDisposition: "medium",
        horizon: "long",
        objective: "growth",
        pressureResponse: "pauseAndReview",
      }),
    }));
  });

  it("normalizes API errors without exposing implementation details", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({
      code: "validation_error",
      message: "Cantidad inválida.",
      traceId: "trace-123",
    }, false, 400)));

    await expect(apiClient.getQuotes()).rejects.toMatchObject({
      status: 400,
      code: "validation_error",
      traceId: "trace-123",
      message: "Cantidad inválida.",
    });
  });

  it("returns a stable network error when the service is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(apiClient.getHealth()).rejects.toMatchObject({ status: 0, code: "network_error" });
  });
});
