import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { PulseProfile } from "../pulse/pulseModel";
import {
  INITIAL_PRACTICE_SESSION,
  PracticeView,
  type PracticeSession,
} from "./PracticeView";

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

describe("PracticeView", () => {
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

  it("keeps market mode informational and isolates it from the sandbox crash", () => {
    render(<PracticeHarness
      mode="market"
      initialSession={{ boughtSymbol: "ETH", crash: true, decision: null }}
    />);

    expect(screen.getByRole("heading", { name: /mercado con contexto/i })).toBeInTheDocument();
    expect(screen.getByText(/datos simulados de referencia/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /simular caída/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /practicar con bitcoin/i })).not.toBeInTheDocument();
    expect(screen.getAllByText("Solo referencia")).toHaveLength(3);
    expect(screen.queryByText("−28.0%")).not.toBeInTheDocument();
    expect(screen.getByText("+2.4%")).toBeInTheDocument();
    expect(screen.getByText("-1.8%")).toBeInTheDocument();
    expect(screen.getByText("+5.2%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /antes de vender/i })).toBeDisabled();
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
