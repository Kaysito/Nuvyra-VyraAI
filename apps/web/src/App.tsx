import { useState } from "react";
import { AppShell, type Page } from "./components/AppShell";
import { LearnView } from "./components/LearnView";
import { PracticeView } from "./components/PracticeView";
import { PulseView, type ProfileResult } from "./components/PulseView";

const initialProfile: ProfileResult = {
  experience: "En calibración",
  tolerance: "Moderada",
  horizon: "Sin definir",
  objective: "Aprender",
  behavioralRisk: "Medio",
  behavioralRiskScore: 50,
  clarity: 0
};

export function App() {
  const [page, setPage] = useState<Page>("Inicio");
  const [profile, setProfile] = useState(initialProfile);
  const [pulseComplete, setPulseComplete] = useState(false);
  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const finishPulse = (result: ProfileResult) => { setProfile(result); setPulseComplete(true); navigate("Aprende"); };

  return <AppShell page={page} onNavigate={navigate} profile={profile}>
    {page === "Inicio" && <HomeView pulseComplete={pulseComplete} profile={profile} onStart={() => navigate(pulseComplete ? "Practica" : "Pulso")} onLearn={() => navigate("Aprende")} onMarket={() => navigate("Mercado")} />}
    {page === "Pulso" && <PulseView onComplete={finishPulse} />}
    {page === "Aprende" && <LearnView onPractice={() => navigate("Practica")} />}
    {page === "Practica" && <PracticeView mode="practice" profile={profile} />}
    {page === "Mercado" && <PracticeView mode="market" profile={profile} />}
    {page === "Portafolio" && <PracticeView mode="portfolio" profile={profile} />}
    {page === "Perfil" && <ProfileView profile={profile} onRetake={() => navigate("Pulso")} />}
  </AppShell>;
}

function HomeView({ pulseComplete, profile, onStart, onLearn, onMarket }: { pulseComplete: boolean; profile: ProfileResult; onStart: () => void; onLearn: () => void; onMarket: () => void }) {
  return <div className="page home-page">
    <section className="hero-grid">
      <div className="hero-copy reveal"><div className="status-pill"><span className="status-dot" /> Inteligencia para decidir, no para obedecer</div><p className="overline">APRENDE · PRACTICA · INVIERTE</p><h1>Tu dinero merece una perspectiva más <span>clara.</span></h1><p className="hero-text">Nuvyra combina educación breve, simulación y análisis asistido por IA para ayudarte a comprender el riesgo antes de actuar.</p><div className="hero-actions"><button className="button primary" onClick={onStart}>{pulseComplete ? "Ir al laboratorio" : "Calibrar mi perfil"}<span>→</span></button><button className="button secondary" onClick={onLearn}>Explorar una lección</button></div><p className="legal-note">Entorno educativo. Tú mantienes siempre el control de cada decisión.</p></div>
      <div className="hero-visual reveal delay-1"><div className="orb orb-one"/><div className="orb orb-two"/><div className="glass-card insight-card"><div className="card-top"><span className="icon-tile">✦</span><span className="micro-label">PERSPECTIVA NUVYRA</span><span className="live-dot">EN CONTEXTO</span></div><p className="insight-title">Una subida rápida no cambia automáticamente el valor de tu plan.</p><div className="signal-row"><span>Compatibilidad con tu perfil</span><strong>Media</strong></div><div className="meter"><span style={{width:`${profile.clarity}%`}}/></div><div className="reason-list"><span>01</span><p>Compara el movimiento con tu horizonte.</p><span>02</span><p>Revisa cuánto concentraría tu portafolio.</p></div></div><div className="floating-card glass-card"><span className="mini-icon">◎</span><div><strong>Modo práctica</strong><small>Sin dinero real</small></div><b>$10,000</b></div></div>
    </section>
    <section className="journey-section reveal delay-2"><div className="section-heading"><div><p className="overline">UN CAMINO PROGRESIVO</p><h2>No tienes que saberlo todo para comenzar.</h2></div><p>Nuvyra revela la complejidad poco a poco, justo cuando la necesitas.</p></div><div className="journey-grid"><JourneyCard number="01" title="Aprende" text="Microlecciones de menos de cuatro minutos, sin lenguaje innecesario." action="Ver lección" onClick={onLearn}/><JourneyCard number="02" title="Practica" text="Prueba decisiones y atraviesa escenarios de volatilidad sin arriesgar capital." action="Abrir sandbox" onClick={onStart} featured/><JourneyCard number="03" title="Analiza" text="Contrasta activos reales con tu objetivo, horizonte y tolerancia al riesgo." action="Explorar mercado" onClick={onMarket}/></div></section>
  </div>;
}

function JourneyCard({number,title,text,action,onClick,featured=false}:{number:string;title:string;text:string;action:string;onClick:()=>void;featured?:boolean}) { return <article className={`journey-card glass-card ${featured?"featured":""}`}><span className="journey-number">{number}</span><h3>{title}</h3><p>{text}</p><button className="text-button" onClick={onClick}>{action} <span>↗</span></button></article>; }
function ProfileView({profile,onRetake}:{profile:ProfileResult;onRetake:()=>void}) { return <div className="page narrow-page"><header className="page-heading"><p className="overline">PERFIL PROGRESIVO</p><h1>Una referencia que evoluciona contigo.</h1><p>Este resultado orienta el lenguaje y las advertencias. No es un diagnóstico ni una etiqueta permanente.</p></header><section className="profile-grid"><div className="glass-card profile-main"><span className="micro-label">CLARIDAD INICIAL</span><strong className="score">{profile.clarity}<small>/100</small></strong><div className="meter large"><span style={{width:`${profile.clarity}%`}}/></div></div><div className="glass-card profile-facts">
      <ProfileFact label="Experiencia" value={profile.experience}/>
      <ProfileFact label="Tolerancia" value={profile.tolerance}/>
      <ProfileFact label="Horizonte" value={profile.horizon}/>
      <ProfileFact label="Objetivo" value={profile.objective}/>
      <ProfileFact label="Riesgo conductual" value={`${profile.behavioralRisk} · ${profile.behavioralRiskScore}/100`}/>
    </div></section><button className="button secondary" onClick={onRetake}>Recalibrar mi perfil</button></div>; }
function ProfileFact({label,value}:{label:string;value:string}) { return <div><span>{label}</span><strong>{value}</strong></div>; }
