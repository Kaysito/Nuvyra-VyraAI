import { useEffect, useRef, useState, type ReactNode } from "react";
import { ThemeControl } from "./ThemeControl";

export type Page = "Inicio" | "Pulso" | "Aprende" | "Practica" | "Mercado" | "Portafolio" | "Perfil";
const navigation: { label: Page; icon: string }[] = [
  { label: "Inicio", icon: "⌂" }, { label: "Aprende", icon: "◇" },
  { label: "Practica", icon: "△" }, { label: "Mercado", icon: "◎" },
  { label: "Portafolio", icon: "▱" }, { label: "Perfil", icon: "○" },
];

export function AppShell({ page, onNavigate, profile, children }: {
  page: Page; onNavigate: (page: Page) => void;
  profile: { experience: string }; children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("nuvyra.sidebar") === "collapsed"; } catch { return false; }
  });
  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem("nuvyra.sidebar", next ? "collapsed" : "expanded"); } catch { /* Session-only preference. */ }
  };
  const main = useRef<HTMLElement>(null);
  const previousPage = useRef(page);
  useEffect(() => {
    if (previousPage.current !== page) {
      main.current?.focus({ preventScroll: true });
      previousPage.current = page;
    }
    document.title = `${page} · Nuvyra`;
  }, [page]);

  return <div className={`app-shell${collapsed ? " sidebar-collapsed" : ""}`}>
    <a className="skip-link" href="#main-content">Saltar al contenido</a>
    <aside className="sidebar glass-sidebar">
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-expanded={!collapsed}
        aria-controls="desktop-navigation" aria-label={collapsed ? "Expandir panel lateral" : "Plegar panel lateral"}
        title={collapsed ? "Expandir panel lateral" : "Plegar panel lateral"}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16m7-12-3 4 3 4" />
        </svg>
      </button>
      <button className="brand-button" onClick={() => onNavigate("Inicio")} aria-label="Nuvyra, inicio">
        <img src="/brand/nuvyra-mark.svg" alt="" />
        <span><b>NUVYRA</b><small>BETA · 0.1</small></span>
      </button>
      <nav id="desktop-navigation" aria-label="Navegación principal">
        {navigation.map(item => <button key={item.label} aria-current={page === item.label ? "page" : undefined}
          aria-label={item.label} title={collapsed ? item.label : undefined}
          className={page === item.label ? "active" : ""} onClick={() => onNavigate(item.label)}>
          <span className="nav-icon" aria-hidden="true">{item.icon}</span><span className="nav-label">{item.label}</span>
          {item.label === "Practica" && <small>SIM</small>}
        </button>)}
      </nav>
      <div className="sidebar-context">
        <p className="micro-label">TU CONTEXTO</p>
        <div><span className="profile-orb" aria-hidden="true">{profile.experience === "En calibración" ? "?" : profile.experience[0]}</span>
          <span><b>{profile.experience}</b><small>{profile.experience === "En calibración" ? "Pulso pendiente" : "Perfil provisional"}</small></span></div>
        <button onClick={() => onNavigate("Perfil")}>Ver perfil <span aria-hidden="true">→</span></button>
      </div>
    </aside>
    <div className="app-content">
      <header className="mobile-header glass-sidebar">
        <button className="brand-button" onClick={() => onNavigate("Inicio")} aria-label="Nuvyra, inicio">
          <img src="/brand/nuvyra-mark.svg" alt="" /><b>NUVYRA</b>
        </button>
        <button className="profile-shortcut" onClick={() => onNavigate("Perfil")}>Perfil</button>
      </header>
      <div className="appearance-bar"><ThemeControl /></div>
      <main id="main-content" ref={main} tabIndex={-1} aria-label={page}>{children}</main>
      <nav className="bottom-nav glass-sidebar" aria-label="Navegación móvil">
        {navigation.slice(0, 5).map(item => <button key={item.label}
          aria-current={page === item.label ? "page" : undefined}
          className={page === item.label ? "active" : ""} onClick={() => onNavigate(item.label)}>
          <span aria-hidden="true">{item.icon}</span><small>{item.label}</small>
        </button>)}
      </nav>
    </div>
  </div>;
}
