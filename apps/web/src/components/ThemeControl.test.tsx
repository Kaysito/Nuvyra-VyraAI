import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeControl } from "./ThemeControl";

describe("ThemeControl", () => {
  beforeEach(() => {
    localStorage.removeItem("nuvyra.theme");
    delete document.documentElement.dataset.theme;
  });

  it("starts in system mode and persists an explicit dark preference", async () => {
    const user = userEvent.setup();
    render(<ThemeControl />);

    expect(screen.getByRole("button", { name: "Sistema" })).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.theme).toBe("light");

    await user.click(screen.getByRole("button", { name: "Oscuro" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("nuvyra.theme")).toBe("dark");
  });

  it("restores a stored light preference", () => {
    localStorage.setItem("nuvyra.theme", "light");
    render(<ThemeControl />);

    expect(screen.getByRole("button", { name: "Claro" })).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("reacts to operating-system theme changes while using system mode", () => {
    let matches = false;
    let changeListener: (() => void) | null = null;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => ({
        get matches() { return matches; },
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_event: string, listener: () => void) => { changeListener = listener; },
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    render(<ThemeControl />);
    expect(document.documentElement.dataset.theme).toBe("light");

    matches = true;
    act(() => changeListener?.());
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
