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

  it("uses the sandbox decision endpoints with explicit JSON contracts", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ symbol: "BTC" }))
      .mockResolvedValueOnce(response(undefined, true, 204))
      .mockResolvedValueOnce(response({ id: "decision-1", scenarios: [] }))
      .mockResolvedValueOnce(response({ id: "decision-1", choice: "ReviewEvidence" }))
      .mockResolvedValueOnce(response(undefined, true, 204));
    vi.stubGlobal("fetch", fetchMock);

    await apiClient.buyVirtual("BTC", 1_000);
    await apiClient.simulateCrash();
    await apiClient.beforeSell("BTC");
    await apiClient.recordDecision("decision-1", "ReviewEvidence");
    await apiClient.resetDemo();

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/sandbox/orders", expect.objectContaining({
      method: "POST", body: JSON.stringify({ symbol: "BTC", amount: 1_000 }),
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/demo/crash", expect.objectContaining({ method: "POST" }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, "/api/decisions/before-sell", expect.objectContaining({
      method: "POST", body: JSON.stringify({ symbol: "BTC" }),
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(4, "/api/decisions/decision-1/choice", expect.objectContaining({
      method: "POST", body: JSON.stringify({ choice: "ReviewEvidence" }),
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(5, "/api/demo/reset", expect.objectContaining({ method: "POST" }));
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
