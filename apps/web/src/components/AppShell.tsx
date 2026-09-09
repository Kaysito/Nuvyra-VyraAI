import { useEffect, useRef, type ReactNode } from "react";
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
  const main = useRef<HTMLElement>(null);
  const previousPage = useRef(page);
  useEffect(() => {
    if (previousPage.current !== page) {
      main.current?.focus({ preventScroll: true });
      previousPage.current = page;
    }
    document.title = `${page} · Nuvyra`;
  }, [page]);

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Saltar al contenido</a>
    <aside className="sidebar glass-sidebar">
      <button className="brand-button" onClick={() => onNavigate("Inicio")} aria-label="Nuvyra, inicio">
        <img src="/brand/nuvyra-mark.svg" alt="" />
        <span><b>NUVYRA</b><small>BETA · 0.1</small></span>
      </button>
      <nav aria-label="Navegación principal">
        {navigation.map(item => <button key={item.label} aria-current={page === item.label ? "page" : undefined}
          className={page === item.label ? "active" : ""} onClick={() => onNavigate(item.label)}>
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}
          {item.label === "Practica" && <small>SIM</small>}
        </button>)}
      </nav>
      <div className="sidebar-context">
        <p className="micro-label">TU CONTEXTO</p>
        <div><span className="profile-orb" aria-hidden="true">{profile.experience === "En calibración" ? "?" : profile.experience[0]}</span>
          <span><b>{profile.experience}</b><small>Perfil adaptable</small></span></div>
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
