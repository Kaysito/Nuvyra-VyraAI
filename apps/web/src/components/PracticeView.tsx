import { useEffect, useRef, useState, type RefObject } from "react";
import type { PulseProfile } from "../pulse/pulseModel";
import {
  getExperienceLabel,
  getHorizonLabel,
  getObjectiveLabel,
  getRiskDispositionLabel,
} from "../pulse/pulsePresentation";
import { apiClient, type DecisionScenarioResponse, type InterventionResponse, type QuoteResponse, type VyraInsightResponse } from "../services/apiClient";
import { addJourneyEvent, localDecisionScenarios, type PracticeAssetSymbol, type PracticeDecision, type PracticeEvent, type PracticeSession } from "./practiceSession";

type PracticeAsset = {
  symbol: PracticeAssetSymbol;
  name: string;
  price: number;
  change: number;
  risk: string;
};

const assets: readonly PracticeAsset[] = [
  { symbol: "BTC", name: "Bitcoin", price: 112450, change: 2.4, risk: "Elevado" },
  { symbol: "ETH", name: "Ethereum", price: 4380, change: -1.8, risk: "Elevado" },
  { symbol: "SOL", name: "Solana", price: 214, change: 5.2, risk: "Muy elevado" },
] as const;

const decisionMessages: Record<PracticeDecision, string> = {
  wait24Hours: "Elegiste esperar 24 horas",
  reviewEvidence: "Elegiste revisar contexto",
  continueSale: "Continuaste con la venta",
};

export function PracticeView({
  mode,
  profile,
  session,
  onSessionChange,
  onPositionCreated,
  onDecisionCompleted,
  totalVyraPoints,
}: {
  mode: "practice" | "market" | "portfolio";
  profile: PulseProfile | null;
  session: PracticeSession;
  onSessionChange: (session: PracticeSession) => void;
  onPositionCreated?: () => void;
  onDecisionCompleted?: () => void;
  totalVyraPoints?: number;
}) {
  const [intervention, setIntervention] = useState(false);
  const [marketAssets, setMarketAssets] = useState<readonly PracticeAsset[]>(assets);
  const [marketState, setMarketState] = useState<"loading" | "live" | "cache" | "fallback">("loading");
  const [marketAsOf, setMarketAsOf] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<PracticeAssetSymbol>("BTC");
  const [insight, setInsight] = useState<VyraInsightResponse | null>(null);
  const [insightState, setInsightState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [interventionData, setInterventionData] = useState<InterventionResponse | null>(null);
  const [sandboxBusy, setSandboxBusy] = useState(false);
  const interventionTrigger = useRef<HTMLButtonElement>(null);
  const bought = session.boughtSymbol !== null;
  const scenarioActive = session.crash && mode !== "market";
  const portfolio = bought ? (scenarioActive ? 9720 : 10000) : 10000;

  const experience = profile ? getExperienceLabel(profile.experience) : "Sin calibrar";
  const riskDisposition = profile ? getRiskDispositionLabel(profile.riskDisposition) : "Sin calibrar";
  const horizon = profile ? getHorizonLabel(profile.horizon) : "Sin definir";
  const objective = profile ? getObjectiveLabel(profile.objective) : "Sin definir";
  const displayAssets = mode === "market" ? marketAssets : assets;

  useEffect(() => {
    if (mode !== "market") return;

    let active = true;
    setMarketState("loading");
    const refreshMarket = () => {
      apiClient.getQuotes()
        .then(quotes => {
          if (!active) return;
          const mapped = mapMarketQuotes(quotes);
          if (mapped.length === assets.length) setMarketAssets(mapped);
          const sources = new Set(quotes.map(quote => quote.source));
          setMarketState(sources.has("coingecko") ? "live" : sources.has("coingecko-cache") ? "cache" : "fallback");
          setMarketAsOf(quotes[0]?.asOf ?? null);
        })
        .catch(() => {
          if (!active) return;
          setMarketAssets(assets);
          setMarketState("fallback");
          setMarketAsOf(null);
        });
    };

    refreshMarket();
    const refreshTimer = window.setInterval(refreshMarket, 30_000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [mode]);

  const updateSession = (patch: Partial<PracticeSession>) => {
    onSessionChange({ ...session, ...patch });
  };

  const createVirtualPosition = async (asset: PracticeAsset) => {
    setSandboxBusy(true);
    try {
      await apiClient.resetDemo();
      await apiClient.buyVirtual(asset.symbol, 1_000);
    } catch { /* The visible demo remains available offline. */ }
    onSessionChange(addJourneyEvent({ ...session, boughtSymbol: asset.symbol }, {
      code: "positionCreated", title: "Posición virtual creada", detail: `Invertiste $1,000 virtuales en ${asset.symbol}.`, points: 10,
    }));
    onPositionCreated?.();
    setSandboxBusy(false);
  };

  const activateCrash = async () => {
    setSandboxBusy(true);
    try { await apiClient.simulateCrash(); } catch { /* Use the deterministic local scenario. */ }
    onSessionChange(addJourneyEvent({ ...session, crash: true }, {
      code: "crashObserved", title: "Caída observada", detail: "Revisaste un movimiento de −28 % sin dinero real.", points: 0,
    }));
    setSandboxBusy(false);
  };

  const generateInsight = (
    symbol: PracticeAssetSymbol,
    intendedAction: "explore" | "sell",
    environment: "market" | "sandbox",
    scenario: "baseline" | "crash",
  ) => {
    setSelectedSymbol(symbol);
    setInsightState("loading");
    apiClient.getInsight({
      symbol,
      intendedAction,
      environment,
      scenario,
      profile: profile ? { ...profile } : null,
      virtualExposurePercent: session.boughtSymbol === symbol ? 10 : 0,
    }).then(result => {
      setInsight(result);
      setInsightState("ready");
    }).catch(() => {
      setInsight(null);
      setInsightState("error");
    });
  };

  return <div className="page practice-page">
    <header className="workspace-header">
      <div>
        <p className="overline">{mode === "market" ? "ANÁLISIS INFORMATIVO" : "LABORATORIO DE DECISIONES"}</p>
        <h1>{mode === "portfolio" ? "Tu portafolio virtual" : mode === "market" ? "Mercado con contexto" : "Practica antes de arriesgar."}</h1>
        <p>{mode === "market" ? marketDescription(marketState, marketAsOf) : "Un escenario controlado donde cada error se convierte en aprendizaje."}</p>
      </div>
      <div className="mode-badge"><span>●</span>{mode === "market" ? marketBadge(marketState) : "SIMULACIÓN · ACTIVA"}</div>
    </header>

    <section className="stats-grid" aria-label="Estado del laboratorio">
      <Stat
        label="VALOR DEL PORTAFOLIO"
        value={`$${portfolio.toLocaleString()}.00`}
        delta={scenarioActive ? "−2.8% en el escenario" : "Saldo completamente virtual"}
        negative={scenarioActive}
      />
      <Stat
        label="VYRAPOINTS"
         value={`${totalVyraPoints ?? 0} VP`}
        delta="Premian aprendizaje y reflexión, nunca ganancias"
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
            onClick={activateCrash}
            disabled={!bought || session.crash || sandboxBusy}
          >{sandboxBusy ? "Preparando…" : "Simular caída"}</button>}
        </div>
        <div className="asset-table">
          <div className="asset-head" aria-hidden="true"><span>Activo</span><span>Precio</span><span>24 h</span><span>Riesgo</span><span/></div>
          {displayAssets.map((asset, index) => <div className="asset-row" key={asset.symbol}>
            <div>
              <span className={`coin coin-${index}`} aria-hidden="true">{asset.symbol[0]}</span>
              <span><b>{asset.name}</b><small>{asset.symbol}</small></span>
            </div>
            <strong>{formatMarketPrice(scenarioActive ? asset.price * .72 : asset.price)}</strong>
            <span className={(scenarioActive || asset.change < 0) ? "negative" : "positive"}>
              {scenarioActive ? "−28.0%" : formatMarketChange(asset.change)}
            </span>
            <span className="risk-label">{asset.risk}</span>
            {mode === "market"
              ? <button
                type="button"
                className="row-action"
                aria-label={`Analizar ${asset.name} con VyraAI`}
                onClick={() => generateInsight(asset.symbol, "explore", "market", "baseline")}
              >Analizar</button>
              : <button
                type="button"
                className="row-action"
                aria-label={session.boughtSymbol === asset.symbol ? `${asset.name} en portafolio` : `Practicar con ${asset.name}`}
                onClick={() => createVirtualPosition(asset)}
                disabled={bought || sandboxBusy}
              >
                {sandboxBusy && !bought ? "Preparando…" : session.boughtSymbol === asset.symbol ? "En portafolio" : "Practicar"}
              </button>}
          </div>)}
        </div>
      </article>

      <aside className="glass-card guide-panel">
        <div className="guide-heading">
          <span className="guide-symbol" aria-hidden="true">✦</span>
          <div><p className="micro-label">NUVYRA GUIDE</p><small>Explicación contextual</small></div>
        </div>
        <h2>{mode === "market" && insight ? insight.title : scenarioActive ? "El mercado cambió. Tu plan quizá no." : bought ? "Tu primera posición ya está activa." : "Primero una decisión pequeña."}</h2>
        <p>{mode === "market" && insight ? insight.observation : mode === "market" && insightState === "error" ? "VyraAI no pudo completar el análisis. El mercado sigue disponible y puedes intentarlo de nuevo." : scenarioActive
          ? `La pérdida existe dentro del escenario. Antes de decidir, contrasta el movimiento con tu horizonte (${horizon}) y tu objetivo (${objective}).`
          : bought
            ? "Ahora puedes experimentar una caída controlada y observar tu reacción."
            : "Empieza con $1,000 virtuales. Podrás observar cómo cambia el escenario sin comprometer dinero real."}</p>
        {mode === "market" && insight && <InsightSummary insight={insight} />}
        <div className="guide-signal"><span>Tu horizonte</span><strong>{horizon}</strong></div>
        {mode === "market" ? <button
          type="button"
          className="button primary full"
          disabled={insightState === "loading"}
          onClick={() => generateInsight(selectedSymbol, "explore", "market", "baseline")}
        >{insightState === "loading" ? "Analizando contexto…" : `Analizar ${selectedSymbol} con VyraAI →`}</button> : <button
          ref={interventionTrigger}
          type="button"
          className="button primary full"
          disabled={!scenarioActive}
          onClick={() => {
            generateInsight(session.boughtSymbol ?? "BTC", "sell", "sandbox", "crash");
            setInterventionData(null);
            apiClient.beforeSell(session.boughtSymbol ?? "BTC")
              .then(result => { if (Array.isArray(result.scenarios)) setInterventionData(result); })
              .catch(() => undefined);
            onSessionChange(addJourneyEvent(session, {
               code: "contextReviewed", title: "Contexto revisado", detail: "Abriste Antes de vender y comparaste alternativas.", points: 0,
            }));
            setIntervention(true);
          }}
        >Antes de vender →</button>}
        <small className="guide-disclaimer">Nuvyra explica y contextualiza. Tú decides.</small>
      </aside>
    </section>

    {mode !== "market" && (session.events?.length ?? 0) > 0 && <DecisionJourney events={session.events ?? []} />}

    {session.decision && <div className="decision-toast" role="status" aria-live="polite">
      <span aria-hidden="true">✓</span>
      <div><strong>Decisión registrada temporalmente</strong><p>{decisionMessages[session.decision]}.</p></div>
      <button type="button" aria-label="Cerrar confirmación" onClick={() => updateSession({ decision: null })}>×</button>
    </div>}

    {intervention && <Intervention
      horizon={horizon}
      insight={insight}
      insightState={insightState}
      scenarios={interventionData?.scenarios ?? localDecisionScenarios()}
      returnFocusRef={interventionTrigger}
      onClose={() => setIntervention(false)}
      onChoose={value => {
        if (interventionData) apiClient.recordDecision(interventionData.id, decisionApiCode(value)).catch(() => undefined);
        onSessionChange(addJourneyEvent({ ...session, decision: value }, {
          code: "decisionRecorded", title: "Decisión consciente registrada", detail: decisionMessages[value] + ".", points: 0,
        }));
        onDecisionCompleted?.();
        setIntervention(false);
      }}
    />}
  </div>;
}

function decisionApiCode(value: PracticeDecision) {
  if (value === "wait24Hours") return "Wait24Hours";
  if (value === "reviewEvidence") return "ReviewEvidence";
  return "ContinueSale";
}

function DecisionJourney({ events }: { events: PracticeEvent[] }) {
  return <section className="glass-card decision-journey" aria-labelledby="journey-title">
    <div className="panel-header"><div><p className="micro-label">PERFIL PROGRESIVO</p><h2 id="journey-title">Tu recorrido de decisiones</h2></div><span className="journey-count">{events.length} {events.length === 1 ? "señal observable" : "señales observables"}</span></div>
    <ol>{events.map(event => <li key={event.code}>
      <span className="journey-dot" aria-hidden="true">✓</span>
      <div><strong>{event.title}</strong><p>{event.detail}</p></div>
       {event.points > 0 && <b>+{event.points} VP</b>}
    </li>)}</ol>
    <small>No diagnosticamos emociones. Este historial describe únicamente acciones realizadas dentro del sandbox.</small>
  </section>;
}

function InsightSummary({ insight }: { insight: VyraInsightResponse }) {
  const factors = Array.isArray(insight.factors) ? insight.factors : [];
  const reflectionQuestions = Array.isArray(insight.reflectionQuestions) ? insight.reflectionQuestions : [];
  return <div className="vyra-insight" aria-live="polite">
    <p className="micro-label">FACTORES OBSERVADOS</p>
    <ul>{factors.slice(0, 3).map(factor => <li key={factor.code}>{factor.message}</li>)}</ul>
    {reflectionQuestions[0] && <p><strong>Para reflexionar:</strong> {reflectionQuestions[0]}</p>}
    <small>{insight.disclaimer}</small>
  </div>;
}

function mapMarketQuotes(quotes: QuoteResponse[]): PracticeAsset[] {
  const supportedSymbols: PracticeAssetSymbol[] = ["BTC", "ETH", "SOL"];
  return supportedSymbols.flatMap(symbol => {
    const quote = quotes.find(candidate => candidate.symbol.toUpperCase() === symbol);
    return quote ? [{
      symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change24Hours,
      risk: quote.volatilityScore >= 85 ? "Muy elevado" : quote.volatilityScore >= 65 ? "Elevado" : "Moderado",
    }] : [];
  });
}

function formatMarketPrice(price: number) {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatMarketChange(change: number) {
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
}

function marketBadge(state: "loading" | "live" | "cache" | "fallback") {
  if (state === "live") return "MERCADO · EN VIVO";
  if (state === "cache") return "MERCADO · CACHÉ";
  if (state === "fallback") return "MERCADO · DEMO";
  return "MERCADO · ACTUALIZANDO";
}

function marketDescription(state: "loading" | "live" | "cache" | "fallback", asOf: string | null) {
  if (state === "loading") return "Actualizando cotizaciones de referencia…";
  if (state === "fallback") return "El proveedor externo no está disponible. Mostramos datos demo claramente identificados.";
  const time = asOf ? new Date(asOf).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "ahora";
  return state === "cache"
    ? `Última cotización disponible de CoinGecko (${time}). Solo información educativa.`
    : `Cotizaciones de CoinGecko actualizadas a las ${time}. Solo información educativa.`;
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
  insight,
  insightState,
  scenarios,
  returnFocusRef,
  onClose,
  onChoose,
}: {
  horizon: string;
  insight: VyraInsightResponse | null;
  insightState: "idle" | "loading" | "ready" | "error";
  scenarios: DecisionScenarioResponse[];
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
      {insightState === "loading" && <p className="insight-loading" role="status">VyraAI está contrastando el escenario con tu pulso…</p>}
      {insightState === "error" && <p className="insight-loading" role="status">No pudimos generar contexto adicional. Tú conservas el control de la decisión.</p>}
      {insightState === "ready" && insight && <InsightSummary insight={insight} />}
      <div className="scenario-heading"><div><p className="micro-label">COMPARA CONSECUENCIAS</p><h3>Tres caminos, sin predicciones</h3></div><small>Valores calculados sobre $1,000 virtuales después de la caída.</small></div>
      <div className="scenario-grid" role="group" aria-label="Alternativas de venta">
        {scenarios.map(scenario => <article key={scenario.code} className="scenario-card">
          <span>{scenario.label}</span>
          <strong>{formatMarketPrice(scenario.cashReleased)}</strong>
          <small>Efectivo liberado</small>
          <dl>
            <div><dt>Exposición restante</dt><dd>{formatMarketPrice(scenario.remainingExposure)}</dd></div>
            <div><dt>Resultado reconocido</dt><dd className={scenario.profitLossRecognized < 0 ? "negative" : ""}>{formatSignedMoney(scenario.profitLossRecognized)}</dd></div>
          </dl>
          <p>{scenario.context}</p>
        </article>)}
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

function formatSignedMoney(value: number) {
  if (value === 0) return "$0.00";
  return `${value > 0 ? "+" : "−"}${formatMarketPrice(Math.abs(value))}`;
}
