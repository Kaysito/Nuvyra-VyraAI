import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.removeItem("nuvyra.sidebar");
  });

  it("persists sidebar collapse and keeps navigation names accessible", async () => {
    const user = userEvent.setup();
    render(<AppShell page="Inicio" onNavigate={vi.fn()} profile={{ experience: "En calibración" }}>Contenido</AppShell>);

    const toggle = screen.getByRole("button", { name: /plegar panel lateral/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);

    expect(screen.getByRole("button", { name: /expandir panel lateral/i })).toHaveAttribute("aria-expanded", "false");
    expect(localStorage.getItem("nuvyra.sidebar")).toBe("collapsed");

    const navigation = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(navigation).getByRole("button", { name: "Practica" })).toBeInTheDocument();
  });

  it("restores a previously collapsed sidebar", () => {
    localStorage.setItem("nuvyra.sidebar", "collapsed");
    render(<AppShell page="Inicio" onNavigate={vi.fn()} profile={{ experience: "En calibración" }}>Contenido</AppShell>);

    expect(screen.getByRole("button", { name: /expandir panel lateral/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("routes through the navigation callback and marks the current page", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<AppShell page="Inicio" onNavigate={onNavigate} profile={{ experience: "Inicial" }}>Contenido</AppShell>);

    const navigation = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(navigation).getByRole("button", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    await user.click(within(navigation).getByRole("button", { name: "Aprende" }));

    expect(onNavigate).toHaveBeenCalledWith("Aprende");
  });

  it("moves focus to main content and updates the title when the page changes", () => {
    const props = { onNavigate: vi.fn(), profile: { experience: "Inicial" } };
    const { rerender } = render(<AppShell page="Inicio" {...props}>Inicio content</AppShell>);

    expect(document.title).toBe("Inicio · Nuvyra");
    rerender(<AppShell page="Perfil" {...props}>Perfil content</AppShell>);

    expect(document.title).toBe("Perfil · Nuvyra");
    expect(screen.getByRole("main", { name: "Perfil" })).toHaveFocus();
  });

  it("distinguishes a pending pulse from a provisional profile in sidebar context", () => {
    const props = { page: "Inicio" as const, onNavigate: vi.fn() };
    const { rerender } = render(<AppShell {...props} profile={{ experience: "En calibración" }}>Contenido</AppShell>);
    expect(screen.getByText("Pulso pendiente")).toBeInTheDocument();

    rerender(<AppShell {...props} profile={{ experience: "Intermedia" }}>Contenido</AppShell>);
    expect(screen.getByText("Perfil provisional")).toBeInTheDocument();
  });

  it("exposes a skip link to the main content", () => {
    render(<AppShell page="Inicio" onNavigate={vi.fn()} profile={{ experience: "Inicial" }}>Contenido</AppShell>);
    expect(screen.getByRole("link", { name: /saltar al contenido/i })).toHaveAttribute("href", "#main-content");
  });
});
