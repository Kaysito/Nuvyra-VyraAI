import { useEffect, useRef, useState, type RefObject } from "react";
import type { PulseProfile } from "../pulse/pulseModel";
import {
  getExperienceLabel,
  getHorizonLabel,
  getObjectiveLabel,
  getRiskDispositionLabel,
} from "../pulse/pulsePresentation";

const assets = [
  { symbol: "BTC", name: "Bitcoin", price: 112450, change: 2.4, risk: "Elevado" },
  { symbol: "ETH", name: "Ethereum", price: 4380, change: -1.8, risk: "Elevado" },
  { symbol: "SOL", name: "Solana", price: 214, change: 5.2, risk: "Muy elevado" },
] as const;

export type PracticeAssetSymbol = (typeof assets)[number]["symbol"];
export type PracticeDecision = "wait24Hours" | "reviewEvidence" | "continueSale";

const decisionMessages: Record<PracticeDecision, string> = {
  wait24Hours: "Elegiste esperar 24 horas",
  reviewEvidence: "Elegiste revisar contexto",
  continueSale: "Continuaste con la venta",
};

export interface PracticeSession {
  boughtSymbol: PracticeAssetSymbol | null;
  crash: boolean;
  decision: PracticeDecision | null;
}

export const INITIAL_PRACTICE_SESSION: PracticeSession = {
  boughtSymbol: null,
  crash: false,
  decision: null,
};

export function PracticeView({
  mode,
  profile,
  session,
  onSessionChange,
}: {
  mode: "practice" | "market" | "portfolio";
  profile: PulseProfile | null;
  session: PracticeSession;
  onSessionChange: (session: PracticeSession) => void;
}) {
  const [intervention, setIntervention] = useState(false);
  const interventionTrigger = useRef<HTMLButtonElement>(null);
  const bought = session.boughtSymbol !== null;
  const scenarioActive = session.crash && mode !== "market";
  const portfolio = bought ? (scenarioActive ? 9720 : 10000) : 10000;

  const experience = profile ? getExperienceLabel(profile.experience) : "Sin calibrar";
  const riskDisposition = profile ? getRiskDispositionLabel(profile.riskDisposition) : "Sin calibrar";
  const horizon = profile ? getHorizonLabel(profile.horizon) : "Sin definir";
  const objective = profile ? getObjectiveLabel(profile.objective) : "Sin definir";

  const updateSession = (patch: Partial<PracticeSession>) => {
    onSessionChange({ ...session, ...patch });
  };

  return <div className="page practice-page">
    <header className="workspace-header">
      <div>
        <p className="overline">{mode === "market" ? "ANÁLISIS INFORMATIVO" : "LABORATORIO DE DECISIONES"}</p>
        <h1>{mode === "portfolio" ? "Tu portafolio virtual" : mode === "market" ? "Mercado con contexto" : "Practica antes de arriesgar."}</h1>
        <p>{mode === "market" ? "Datos simulados de referencia para comprender, no cotizaciones en tiempo real." : "Un escenario controlado donde cada error se convierte en aprendizaje."}</p>
      </div>
      <div className="mode-badge"><span>●</span>{mode === "market" ? "MERCADO · REFERENCIA" : "SIMULACIÓN · ACTIVA"}</div>
    </header>

    <section className="stats-grid" aria-label="Estado del laboratorio">
      <Stat
        label="VALOR DEL PORTAFOLIO"
        value={`$${portfolio.toLocaleString()}.00`}
        delta={scenarioActive ? "−2.8% en el escenario" : "Saldo completamente virtual"}
        negative={scenarioActive}
      />
      <Stat
        label="EFECTIVO DISPONIBLE"
        value={bought ? "$9,000.00" : "$10,000.00"}
        delta={bought ? "$1,000 invertidos" : "Listo para practicar"}
      />
      <Stat
        label="REFERENCIA DEL PULSO"
        value={riskDisposition}
        delta={profile ? `${experience} · ${horizon}` : "Completa tu pulso para añadir contexto"}
      />
    </section>

    <section className="workspace-grid">
      <article className="glass-card market-panel">
        <div className="panel-header">
          <div><p className="micro-label">ACTIVOS OBSERVADOS</p><h2>Mercado</h2></div>
          {mode === "practice" && <button
            type="button"
            className="button subtle"
            onClick={() => updateSession({ crash: true })}
            disabled={!bought || session.crash}
          >Simular caída</button>}
        </div>
        <div className="asset-table">
          <div className="asset-head" aria-hidden="true"><span>Activo</span><span>Precio</span><span>24 h</span><span>Riesgo</span><span/></div>
          {assets.map((asset, index) => <div className="asset-row" key={asset.symbol}>
            <div>
              <span className={`coin coin-${index}`} aria-hidden="true">{asset.symbol[0]}</span>
              <span><b>{asset.name}</b><small>{asset.symbol}</small></span>
            </div>
            <strong>${(scenarioActive ? asset.price * .72 : asset.price).toLocaleString()}</strong>
            <span className={(scenarioActive || asset.change < 0) ? "negative" : "positive"}>
              {scenarioActive ? "−28.0%" : `${asset.change > 0 ? "+" : ""}${asset.change}%`}
            </span>
            <span className="risk-label">{asset.risk}</span>
            {mode === "market"
              ? <span className="row-state">Solo referencia</span>
              : <button
                type="button"
                className="row-action"
                aria-label={session.boughtSymbol === asset.symbol ? `${asset.name} en portafolio` : `Practicar con ${asset.name}`}
                onClick={() => updateSession({ boughtSymbol: asset.symbol })}
                disabled={bought}
              >
                {session.boughtSymbol === asset.symbol ? "En portafolio" : "Practicar"}
              </button>}
          </div>)}
        </div>
      </article>

      <aside className="glass-card guide-panel">
        <div className="guide-heading">
          <span className="guide-symbol" aria-hidden="true">✦</span>
          <div><p className="micro-label">NUVYRA GUIDE</p><small>Explicación contextual</small></div>
        </div>
        <h2>{scenarioActive ? "El mercado cambió. Tu plan quizá no." : bought ? "Tu primera posición ya está activa." : "Primero una decisión pequeña."}</h2>
        <p>{scenarioActive
          ? `La pérdida existe dentro del escenario. Antes de decidir, contrasta el movimiento con tu horizonte (${horizon}) y tu objetivo (${objective}).`
          : bought
            ? "Ahora puedes experimentar una caída controlada y observar tu reacción."
            : "Empieza con $1,000 virtuales. Podrás observar cómo cambia el escenario sin comprometer dinero real."}</p>
        <div className="guide-signal"><span>Tu horizonte</span><strong>{horizon}</strong></div>
        <button
          ref={interventionTrigger}
          type="button"
          className="button primary full"
          disabled={!scenarioActive}
          onClick={() => setIntervention(true)}
        >Antes de vender →</button>
        <small className="guide-disclaimer">Nuvyra explica y contextualiza. Tú decides.</small>
      </aside>
    </section>

    {session.decision && <div className="decision-toast" role="status" aria-live="polite">
      <span aria-hidden="true">✓</span>
      <div><strong>Decisión registrada temporalmente</strong><p>{decisionMessages[session.decision]}.</p></div>
      <button type="button" aria-label="Cerrar confirmación" onClick={() => updateSession({ decision: null })}>×</button>
    </div>}

    {intervention && <Intervention
      horizon={horizon}
      returnFocusRef={interventionTrigger}
      onClose={() => setIntervention(false)}
      onChoose={value => {
        updateSession({ decision: value });
        setIntervention(false);
      }}
    />}
  </div>;
}

function Stat({
  label,
  value,
  delta,
  negative = false,
}: {
  label: string;
  value: string;
  delta: string;
  negative?: boolean;
}) {
  return <div className="glass-card stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
    <small className={negative ? "negative" : ""}>{delta}</small>
  </div>;
}

function Intervention({
  horizon,
  returnFocusRef,
  onClose,
  onChoose,
}: {
  horizon: string;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onChoose: (value: PracticeDecision) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      returnFocusRef.current?.focus();
    };
  }, [returnFocusRef]);

  return <dialog
    ref={dialog}
    className="glass-card intervention-modal native-dialog"
    aria-labelledby="intervention-title"
    onCancel={onClose}
  >
    <section>
      <button type="button" className="modal-close" aria-label="Cerrar pausa" onClick={onClose} autoFocus>×</button>
      <div className="pause-mark" aria-hidden="true"><span>Ⅱ</span></div>
      <p className="overline">PAUSA INTENCIONAL</p>
      <h2 id="intervention-title">Estás viendo una pérdida rápida, no toda la historia.</h2>
      <p>Vender sigue siendo tu decisión. Antes, contrasta el movimiento con el plan que definiste.</p>
      <div className="intervention-metrics">
        <div><span>Movimiento</span><strong className="negative">−28%</strong></div>
        <div><span>Volatilidad</span><strong>Alta</strong></div>
        <div><span>Horizonte</span><strong>{horizon}</strong></div>
      </div>
      <div className="decision-actions">
        <button type="button" className="button secondary" onClick={() => onChoose("wait24Hours")}>Esperar 24 horas</button>
        <button type="button" className="button secondary" onClick={() => onChoose("reviewEvidence")}>Revisar contexto</button>
        <button type="button" className="button secondary" onClick={() => onChoose("continueSale")}>Continuar con la venta</button>
      </div>
      <small className="modal-note">No hay temporizador ni bloqueo. El objetivo es darte contexto, no controlar tu operación.</small>
    </section>
  </dialog>;
}
