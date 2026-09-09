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

  return <label className="theme-control">
    <span aria-hidden="true">◐</span><span>Apariencia</span>
    <select value={theme} onChange={event => setTheme(event.target.value as Theme)}>
      <option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option>
    </select>
  </label>;
}
