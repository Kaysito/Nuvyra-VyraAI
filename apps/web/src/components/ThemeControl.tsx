import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const storageKey = "nuvyra.theme";

function readPreference(): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* Storage may be unavailable in private or restricted contexts. */ }
  return "system";
}

export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>(readPreference);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = theme === "system" ? (query.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#0b1420" : "#f3f5ef");
    };
    apply();
    query.addEventListener("change", apply);
    try { localStorage.setItem(storageKey, theme); } catch { /* The theme still works for this session. */ }
    return () => query.removeEventListener("change", apply);
  }, [theme]);

  const options = [
    { value: "light", label: "Claro" },
    { value: "dark", label: "Oscuro" },
    { value: "system", label: "Sistema" },
  ] as const;
  return <div className="theme-switch" role="group" aria-label="Apariencia">
    <span className="theme-slider" aria-hidden="true" style={{ transform: `translateX(${options.findIndex(option => option.value === theme) * 100}%)` }} />
    {options.map(option => <button key={option.value} className="theme-option"
      aria-pressed={theme === option.value} onClick={() => setTheme(option.value)} title={`Tema ${option.label.toLowerCase()}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {option.value === "light" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>
          : option.value === "dark" ? <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
          : <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>}
      </svg><span>{option.label}</span>
    </button>)}
  </div>;
}
