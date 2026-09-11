import { useState } from "react";
import { AppShell, type Page } from "./components/AppShell";
import { LearnView } from "./components/LearnView";
import { INITIAL_PRACTICE_SESSION, PracticeView, type PracticeSession } from "./components/PracticeView";
import { VyraPointsCard } from "./components/VyraPointsCard";
import {
  awardPoints,
  INITIAL_VYRA_POINTS_STATE,
  LESSON_COMPLETED,
  PRACTICE_DECISION_COMPLETED,
  PRACTICE_POSITION_CREATED,
  PULSE_COMPLETED,
  type VyraPointsState,
} from "./demo/vyraPoints";
import { PulseV1View } from "./pulse/PulseV1View";
import type { PulseProfile } from "./pulse/pulseModel";
import {
  getExperienceLabel,
  getHorizonLabel,
  getObjectiveLabel,
  getPressureResponseLabel,
  getRiskDispositionLabel,
} from "./pulse/pulsePresentation";

export function App() {
  const [page, setPage] = useState<Page>("Inicio");
  const [profile, setProfile] = useState<PulseProfile | null>(null);
  const [practiceSession, setPracticeSession] = useState<PracticeSession>(() => ({ ...INITIAL_PRACTICE_SESSION }));
  const [completedLessonIds, setCompletedLessonIds] = useState<ReadonlySet<string>>(() => new Set());
  const [vyraPoints, setVyraPoints] = useState<VyraPointsState>(() => ({
    points: INITIAL_VYRA_POINTS_STATE.points,
    awardedActions: new Set(INITIAL_VYRA_POINTS_STATE.awardedActions),
  }));
  const pulseComplete = profile !== null;

  const award = (actionId: string, amount: number) => {
    setVyraPoints(state => awardPoints(state, actionId, amount));
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessonIds(current => {
      if (current.has(lessonId)) return current;
      const next = new Set(current);
      next.add(lessonId);
      return next;
    });
    award(`lesson:${lessonId}:completed`, LESSON_COMPLETED);
  };

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    // `auto` is supported across browsers; `instant` is not part of the standard ScrollBehavior values.
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const finishPulse = (result: PulseProfile) => {
    award("pulse:completed", PULSE_COMPLETED);
    setProfile(result);
    navigate("Aprende");
  };

  const profileExperience = profile ? getExperienceLabel(profile.experience) : "En calibración";

  return <AppShell page={page} onNavigate={navigate} profile={{ experience: profileExperience }}>
    {page === "Inicio" && <HomeView
      pulseComplete={pulseComplete}
      profile={profile}
      points={vyraPoints.points}
      onStart={() => navigate(pulseComplete ? "Practica" : "Pulso")}
      onLearn={() => navigate("Aprende")}
      onMarket={() => navigate("Mercado")}
    />}
    {page === "Pulso" && <PulseV1View onComplete={finishPulse} />}
    {page === "Aprende" && <LearnView
      onPractice={() => navigate("Practica")}
      completedLessonIds={completedLessonIds}
      onLessonComplete={completeLesson}
    />}
    {page === "Practica" && <PracticeView
      mode="practice"
      profile={profile}
      session={practiceSession}
      onSessionChange={setPracticeSession}
      onPositionCreated={() => award("practice:first-position", PRACTICE_POSITION_CREATED)}
      onDecisionCompleted={() => award("practice:first-decision", PRACTICE_DECISION_COMPLETED)}
    />}
    {page === "Mercado" && <PracticeView mode="market" profile={profile} session={practiceSession} onSessionChange={setPracticeSession} />}
    {page === "Portafolio" && <PracticeView mode="portfolio" profile={profile} session={practiceSession} onSessionChange={setPracticeSession} />}
    {page === "Perfil" && <ProfileView profile={profile} onRetake={() => navigate("Pulso")} />}
  </AppShell>;
}

function HomeView({
  pulseComplete,
  profile,
  points,
  onStart,
  onLearn,
  onMarket,
}: {
  pulseComplete: boolean;
  profile: PulseProfile | null;
  points: number;
  onStart: () => void;
  onLearn: () => void;
  onMarket: () => void;
}) {
  const horizon = profile ? getHorizonLabel(profile.horizon) : "Aún sin definir";
  const objective = profile ? getObjectiveLabel(profile.objective) : "Completa tu pulso inicial";

  return <div className="page home-page">
    <section className="hero-grid">
      <div className="hero-copy reveal">
        <div className="status-pill"><span className="status-dot" /> Inteligencia para decidir, no para obedecer</div>
        <p className="overline">APRENDE · PRACTICA · ANALIZA</p>
        <h1>Tu dinero merece una perspectiva más <span>clara.</span></h1>
        <p className="hero-text">Nuvyra combina educación breve, simulación y análisis asistido por IA para ayudarte a comprender el riesgo antes de actuar.</p>
        <div className="hero-actions">
          <button className="button primary" onClick={onStart}>{pulseComplete ? "Ir al laboratorio" : "Calibrar mi perfil"}<span>→</span></button>
          <button className="button secondary" onClick={onLearn}>Explorar una lección</button>
        </div>
        <p className="legal-note">Entorno educativo. Tú mantienes siempre el control de cada decisión.</p>
      </div>
      <div className="hero-visual reveal delay-1">
        <div className="orb orb-one"/>
        <div className="orb orb-two"/>
        <div className="glass-card insight-card">
          <div className="card-top">
            <span className="icon-tile">✦</span>
            <span className="micro-label">PERSPECTIVA NUVYRA</span>
            <span className="live-dot">EN CONTEXTO</span>
          </div>
          <p className="insight-title">Una subida rápida no cambia automáticamente el valor de tu plan.</p>
          <div className="signal-row">
            <span>Estado del pulso</span>
            <strong>{profile ? "Perfil provisional" : "Sin calibrar"}</strong>
          </div>
          <div className="reason-list">
            <span>01</span><p>Horizonte: {horizon}.</p>
            <span>02</span><p>Objetivo: {objective}.</p>
          </div>
        </div>
        <div className="floating-card glass-card">
          <span className="mini-icon">◎</span>
          <div><strong>Modo práctica</strong><small>Sin dinero real</small></div>
          <b>$10,000</b>
        </div>
      </div>
    </section>
    <VyraPointsCard points={points} />
    <section className="journey-section reveal delay-2">
      <div className="section-heading">
        <div>
          <p className="overline">UN CAMINO PROGRESIVO</p>
          <h2>No tienes que saberlo todo para comenzar.</h2>
        </div>
        <p>Nuvyra revela la complejidad poco a poco, justo cuando la necesitas.</p>
      </div>
      <div className="journey-grid">
        <JourneyCard number="01" title="Aprende" text="Microlecciones de menos de cuatro minutos, sin lenguaje innecesario." action="Ver lección" onClick={onLearn}/>
        <JourneyCard number="02" title="Practica" text="Prueba decisiones y atraviesa escenarios de volatilidad sin arriesgar capital." action="Abrir sandbox" onClick={onStart} featured/>
        <JourneyCard number="03" title="Analiza" text="Contrasta activos de referencia con tu objetivo, horizonte y disposición ante el riesgo." action="Explorar mercado" onClick={onMarket}/>
      </div>
    </section>
  </div>;
}

function JourneyCard({
  number,
  title,
  text,
  action,
  onClick,
  featured = false,
}: {
  number: string;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
  featured?: boolean;
}) {
  return <article className={`journey-card glass-card ${featured ? "featured" : ""}`}>
    <span className="journey-number">{number}</span>
    <h3>{title}</h3>
    <p>{text}</p>
    <button className="text-button" onClick={onClick}>{action} <span>↗</span></button>
  </article>;
}

function ProfileView({ profile, onRetake }: { profile: PulseProfile | null; onRetake: () => void }) {
  if (!profile) {
    return <div className="page narrow-page">
      <header className="page-heading">
        <div>
          <p className="overline">PERFIL PROGRESIVO</p>
          <h1>Tu pulso inicial aún está por definirse.</h1>
          <p>Responde cinco preguntas breves para crear una referencia educativa que podrás recalibrar cuando cambie tu perspectiva.</p>
        </div>
      </header>
      <section className="glass-card profile-main">
        <span className="micro-label">SIN CALIBRAR</span>
        <h2>Primero necesitamos tu perspectiva.</h2>
        <p>No asignaremos un puntaje global ni una etiqueta psicológica. Las cinco dimensiones se mantienen separadas.</p>
        <button className="button primary" onClick={onRetake}>Comenzar mi pulso →</button>
      </section>
    </div>;
  }

  return <div className="page narrow-page">
    <header className="page-heading">
      <div>
        <p className="overline">PERFIL PROGRESIVO</p>
        <h1>Una referencia que puedes recalibrar.</h1>
        <p>Este resultado orienta el lenguaje y el contexto educativo. No es un diagnóstico ni una etiqueta permanente.</p>
      </div>
    </header>
    <section className="profile-grid">
      <div className="glass-card profile-main">
        <span className="micro-label">LECTURA INICIAL</span>
        <h2>Perfil provisional</h2>
        <p>Tu pulso conserva cada dimensión por separado. No las combina en un puntaje global.</p>
        <span className="profile-version">{profile.assessmentVersion}</span>
      </div>
      <div className="glass-card profile-facts" role="group" aria-label="Dimensiones del pulso">
        <ProfileFact label="Experiencia" value={getExperienceLabel(profile.experience)}/>
        <ProfileFact label="Disposición ante el riesgo" value={getRiskDispositionLabel(profile.riskDisposition)}/>
        <ProfileFact label="Horizonte" value={getHorizonLabel(profile.horizon)}/>
        <ProfileFact label="Objetivo" value={getObjectiveLabel(profile.objective)}/>
        <ProfileFact label="Ante presión" value={getPressureResponseLabel(profile.pressureResponse)}/>
      </div>
    </section>
    <p className="profile-note">Esta es una primera referencia educativa. Puedes recalibrarla cuando cambien tus objetivos o tu perspectiva.</p>
    <button className="button secondary" onClick={onRetake}>Recalibrar mi perfil</button>
  </div>;
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
