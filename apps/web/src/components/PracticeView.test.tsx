import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PulseProfile } from "../pulse/pulseModel";
import {
  PracticeView,
} from "./PracticeView";
import {
  INITIAL_PRACTICE_SESSION,
  addJourneyEvent,
  localDecisionScenarios,
  type PracticeSession,
} from "./practiceSession";

const profile: PulseProfile = {
  experience: "intermediate",
  riskDisposition: "medium",
  horizon: "long",
  objective: "growth",
  pressureResponse: "pauseAndReview",
  isProvisional: true,
  assessmentVersion: "pulse-v1",
};

function PracticeHarness({
  mode = "practice",
  initialSession = INITIAL_PRACTICE_SESSION,
  pulseProfile = profile,
}: {
  mode?: "practice" | "market" | "portfolio";
  initialSession?: PracticeSession;
  pulseProfile?: PulseProfile | null;
}) {
  const [session, setSession] = useState<PracticeSession>(() => ({ ...initialSession }));
  return <PracticeView mode={mode} profile={pulseProfile} session={session} onSessionChange={setSession} />;
}

async function openIntervention() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /practicar con ethereum/i }));
  expect(screen.getByRole("button", { name: /ethereum en portafolio/i })).toHaveTextContent("En portafolio");
  await user.click(screen.getByRole("button", { name: /simular caída/i }));
  const trigger = screen.getByRole("button", { name: /antes de vender/i });
  await user.click(trigger);
  return { user, trigger };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(url === "/api/guide/insights" ? {
      id: "insight-1",
      title: "Revisa el contexto antes de decidir",
      observation: "VyraAI observó el movimiento del activo.",
      factors: [
        { code: "sharp_drop", message: "El activo registra una caída en el escenario observado." },
        { code: "profile_context", message: "Tu horizonte y objetivo se mantienen separados." },
      ],
      reflectionQuestions: ["¿Cambió tu objetivo o solamente cambió el precio?"],
      behavioralSignals: ["rapidDecisionAfterDrop"],
      source: "vyra-rules-v0.1",
      marketSource: "sandbox-simulation",
      isEducational: true,
      generatedAt: "2026-09-11T12:00:00Z",
      disclaimer: "Contenido educativo. VyraAI contextualiza información; no decide por ti.",
    } : [
      { symbol: "BTC", name: "Bitcoin", price: 70000, change24Hours: 3.1, volatilityScore: 72, asOf: "2026-09-11T12:00:00Z", source: "coingecko" },
      { symbol: "ETH", name: "Ethereum", price: 3500, change24Hours: -1.2, volatilityScore: 79, asOf: "2026-09-11T12:00:00Z", source: "coingecko" },
      { symbol: "SOL", name: "Solana", price: 180, change24Hours: 4.8, volatilityScore: 88, asOf: "2026-09-11T12:00:00Z", source: "coingecko" },
    ]),
  })));
});

afterEach(() => vi.unstubAllGlobals());

describe("PracticeView", () => {
  it("compares deterministic sell consequences without forecasting", () => {
    const scenarios = localDecisionScenarios();
    expect(scenarios.map(item => item.code)).toEqual(["sellAll", "sellHalf", "hold"]);
    expect(scenarios.find(item => item.code === "sellAll")?.remainingExposure).toBe(0);
    expect(scenarios.find(item => item.code === "sellHalf")?.cashReleased).toBe(360);
    expect(scenarios.find(item => item.code === "hold")?.profitLossRecognized).toBe(0);
  });

  it("awards each educational journey milestone only once", () => {
    const event = { code: "contextReviewed" as const, title: "Contexto revisado", detail: "Comparaste alternativas.", points: 15 };
    const first = addJourneyEvent(INITIAL_PRACTICE_SESSION, event);
    const duplicate = addJourneyEvent(first, event);
    expect(first.vyraPoints).toBe(15);
    expect(duplicate.vyraPoints).toBe(15);
    expect(duplicate.events).toHaveLength(1);
  });

  it("renders a safe uncalibrated state without legacy profile scoring", () => {
    render(<PracticeHarness pulseProfile={null} />);

    expect(screen.getByText("REFERENCIA DEL PULSO")).toBeInTheDocument();
    expect(screen.getAllByText("Sin calibrar").length).toBeGreaterThan(0);
    expect(screen.getByText(/completa tu pulso para añadir contexto/i)).toBeInTheDocument();
    expect(screen.queryByText(/claridad del perfil/i)).not.toBeInTheDocument();
  });

  it("uses pulse-v1 context through purchase, crash and the neutral intervention", async () => {
    render(<PracticeHarness />);
    const { user } = await openIntervention();

    expect(screen.getByRole("dialog", { name: /estás viendo una pérdida rápida/i })).toBeInTheDocument();
    expect(screen.getAllByText("Largo plazo").length).toBeGreaterThan(0);
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Nuvyra explica y contextualiza. Tú decides.")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /alternativas de venta/i })).toBeInTheDocument();
    expect(screen.getByText("Tres caminos, sin predicciones")).toBeInTheDocument();
    expect(screen.getByText("Vender 50 %")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/¿cambió tu objetivo/i)).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /revisar contexto/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Elegiste revisar contexto");

    await user.click(screen.getByRole("button", { name: /cerrar confirmación/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it.each([
    ["Esperar 24 horas", "Elegiste esperar 24 horas"],
    ["Continuar con la venta", "Continuaste con la venta"],
  ])("records the neutral intervention choice %s", async (buttonName, expected) => {
    render(<PracticeHarness />);
    const { user } = await openIntervention();
    await user.click(screen.getByRole("button", { name: buttonName }));
    expect(screen.getByRole("status")).toHaveTextContent(expected);
  });

  it("closes the intervention without recording a decision and restores focus", async () => {
    render(<PracticeHarness />);
    const { user, trigger } = await openIntervention();
    await user.click(screen.getByRole("button", { name: /cerrar pausa/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes the native dialog on cancel and restores focus to its trigger", async () => {
    render(<PracticeHarness />);
    const { trigger } = await openIntervention();
    const dialog = screen.getByRole("dialog", { name: /estás viendo una pérdida rápida/i });

    fireEvent(dialog, new Event("cancel", { cancelable: true }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("shows live market data and isolates it from the sandbox crash", async () => {
    render(<PracticeHarness
      mode="market"
      initialSession={{ boughtSymbol: "ETH", crash: true, decision: null }}
    />);

    expect(screen.getByRole("heading", { name: /mercado con contexto/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("MERCADO · EN VIVO")).toBeInTheDocument());
    expect(screen.getByText(/cotizaciones de coingecko/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /simular caída/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /practicar con bitcoin/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /analizar .* con vyraai/i })).toHaveLength(4);
    expect(screen.queryByText("−28.0%")).not.toBeInTheDocument();
    expect(screen.getByText("+3.10%")).toBeInTheDocument();
    expect(screen.getByText("-1.20%")).toBeInTheDocument();
    expect(screen.getByText("+4.80%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /analizar btc con vyraai/i })).toBeEnabled();
  });

  it("sends the selected market asset and provisional pulse to VyraAI", async () => {
    const fetchMock = vi.mocked(fetch);
    const user = userEvent.setup();
    render(<PracticeHarness mode="market" />);
    await waitFor(() => expect(screen.getByText("MERCADO · EN VIVO")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /analizar solana con vyraai/i }));
    await waitFor(() => expect(screen.getByText(/revisa el contexto antes de decidir/i)).toBeInTheDocument());

    const insightCall = fetchMock.mock.calls.find(([url]) => url === "/api/guide/insights");
    expect(insightCall).toBeDefined();
    expect(JSON.parse(String(insightCall?.[1]?.body))).toMatchObject({
      symbol: "SOL",
      intendedAction: "explore",
      environment: "market",
      scenario: "baseline",
      profile: { assessmentVersion: "pulse-v1", horizon: "long", objective: "growth" },
    });
  });

  it("identifies local fallback data when the market API is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    render(<PracticeHarness mode="market" />);

    await waitFor(() => expect(screen.getByText("MERCADO · DEMO")).toBeInTheDocument());
    expect(screen.getByText(/proveedor externo no está disponible/i)).toBeInTheDocument();
    expect(screen.getByText("+2.40%")).toBeInTheDocument();
  });

  it("renders a previously created virtual position in portfolio mode", () => {
    render(<PracticeHarness
      mode="portfolio"
      initialSession={{ boughtSymbol: "ETH", crash: true, decision: null }}
    />);

    expect(screen.getByRole("heading", { name: /tu portafolio virtual/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ethereum en portafolio/i })).toHaveTextContent("En portafolio");
    expect(screen.getByText("$9,000.00")).toBeInTheDocument();
    expect(screen.getAllByText("−28.0%")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: /simular caída/i })).not.toBeInTheDocument();
  });
});
