import { useState } from "react";

const assets = [
  { symbol: "BTC", name: "Bitcoin", price: "$112,450", change: "+2.4%", risk: "Elevado" },
  { symbol: "ETH", name: "Ethereum", price: "$4,380", change: "−1.8%", risk: "Elevado" },
  { symbol: "SOL", name: "Solana", price: "$214", change: "+5.2%", risk: "Muy elevado" }
];

export function App() {
  const [crash, setCrash] = useState(false);
  const [intervention, setIntervention] = useState(false);

  return <main>
    <nav><div className="brand"><span className="mark">N</span><span>NUVYRA</span></div><button className="ghost">Perfil moderado</button></nav>
    <section className="hero">
      <div><span className="eyebrow">LABORATORIO DE DECISIONES</span><h1>Ve el riesgo desde<br/><em>otra perspectiva.</em></h1><p>Practica, entiende tus impulsos y decide con más claridad. Aquí todo el dinero es virtual.</p></div>
      <div className="balance"><span>Portafolio virtual</span><strong>{crash ? "$8,320.00" : "$10,000.00"}</strong><small className={crash ? "negative" : "positive"}>{crash ? "−16.8% en este escenario" : "+0.0% hoy"}</small></div>
    </section>
    <section className="grid">
      <article className="panel wide"><header><div><span className="eyebrow">MERCADO SIMULADO</span><h2>Explora sin arriesgar</h2></div><button onClick={() => setCrash(true)} className="danger">Simular caída</button></header>
        <div className="asset-list">{assets.map(asset => <div className="asset" key={asset.symbol}><div className="coin">{asset.symbol[0]}</div><div><b>{asset.name}</b><small>{asset.symbol}</small></div><div><b>{crash ? "−28.0%" : asset.change}</b><small>24 horas</small></div><div><b>{asset.risk}</b><small>Para tu perfil</small></div><strong>{crash ? "Escenario de estrés" : asset.price}</strong></div>)}</div>
      </article>
      <aside className="panel guide"><span className="eyebrow">NUVYRA GUIDE</span><h2>{crash ? "Una caída no exige una reacción inmediata." : "Tu calma también es una habilidad."}</h2><p>{crash ? "El mercado cambió. Tu objetivo quizá no. Revisemos ambas cosas antes de actuar." : "Te mostraremos contexto cuando detectemos una decisión bajo presión."}</p><button onClick={() => setIntervention(true)} disabled={!crash}>Antes de vender</button></aside>
    </section>
    {intervention && <div className="modal-backdrop"><section className="modal"><button className="close" onClick={() => setIntervention(false)}>×</button><span className="eyebrow">PAUSA INTENCIONAL</span><h2>Estás viendo una pérdida rápida, no toda la historia.</h2><p>Vender sigue siendo tu decisión. Antes, compara el movimiento actual con tu plan y tu horizonte.</p><div className="metrics"><div><b>−28%</b><small>movimiento simulado</small></div><div><b>96/100</b><small>volatilidad</small></div></div><button onClick={() => setIntervention(false)}>Esperar 24 horas</button><button className="ghost">Revisar evidencia</button><button className="text">Continuar con la venta</button></section></div>}
  </main>;
}
