import { useState } from "react";

export type ProfileResult = {
  id?: string;
  experience: string;
  tolerance: string;
  horizon: string;
  objective: string;
  behavioralRisk: string;
  behavioralRiskScore: number;
  clarity: number;
};

type PulseOption = { text: string; value: string };
type PulseQuestion = { id: string; title: string; hint: string; options: PulseOption[] };

const questions: PulseQuestion[] = [
  {
    id: "pulse.experience",
    title: "¿Qué experiencia tienes tomando decisiones de inversión?",
    hint: "No hay una respuesta mejor que otra.",
    options: [
      { text: "Nunca he invertido", value: "beginner" },
      { text: "He realizado algunas inversiones", value: "intermediate" },
      { text: "Invierto con frecuencia y conozco los conceptos básicos", value: "experienced" }
    ]
  },
  {
    id: "pulse.loss-reaction",
    title: "Si una inversión que tienes baja 20 %, ¿qué harías primero?",
    hint: "Piensa en tu reacción más probable.",
    options: [
      { text: "Vendería para evitar perder más", value: "sell" },
      { text: "Revisaría la situación antes de decidir", value: "review" },
      { text: "Mantendría la posición si mi plan no ha cambiado", value: "hold" }
    ]
  },
  {
    id: "pulse.horizon",
    title: "¿Cuánto tiempo planeas mantener normalmente una inversión?",
    hint: "El horizonte cambia el contexto de una decisión.",
    options: [
      { text: "Menos de 1 año", value: "short" },
      { text: "Entre 1 y 5 años", value: "medium" },
      { text: "Más de 5 años", value: "long" }
    ]
  },
  {
    id: "pulse.objective",
    title: "¿Qué te gustaría conseguir principalmente al aprender sobre inversiones?",
    hint: "Puedes cambiar este objetivo después.",
    options: [
      { text: "Entender mejor cómo funcionan", value: "learn" },
      { text: "Cuidar lo que ya tengo", value: "preserve" },
      { text: "Buscar crecimiento a largo plazo", value: "grow" },
      { text: "Probar diferentes estrategias", value: "explore" }
    ]
  },
  {
    id: "pulse.uncertainty",
    title: "¿Qué tan cómodo te sientes cuando no puedes saber con certeza qué hará una inversión?",
    hint: "Esto mide tolerancia, no conocimiento.",
    options: [
      { text: "Prefiero evitar mucha incertidumbre", value: "low" },
      { text: "Puedo aceptar cierta incertidumbre", value: "medium" },
      { text: "Me siento cómodo tomando decisiones con incertidumbre", value: "high" }
    ]
  }
];

export function PulseView({ onComplete }: { onComplete: (profile: ProfileResult) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const choose = async (answer: string) => {
    const next = [...answers, answer];
    if (step < questions.length - 1) {
      setAnswers(next);
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/profiles/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: next })
      });
      if (!response.ok) throw new Error("No fue posible calcular el perfil.");
      const profile = await response.json() as ProfileResult;
      onComplete(profile);
    } catch {
      setError("No pudimos calcular el resultado. Verifica que la API de Nuvyra esté activa e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const question = questions[step];

  return <div className="page pulse-page">
    <div className="pulse-header">
      <div>
        <p className="overline">PULSO INICIAL · MENOS DE 90 SEGUNDOS</p>
        <h1>Empecemos por tu perspectiva.</h1>
      </div>
      <strong>{step + 1}<small> / {questions.length}</small></strong>
    </div>

    <div className="progress-track">
      <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
    </div>

    <section className="glass-card question-card">
      <p className="micro-label">PREGUNTA {String(step + 1).padStart(2, "0")}</p>
      <h2>{question.title}</h2>
      <p>{question.hint}</p>
      <div className="answer-grid">
        {question.options.map((option, index) =>
          <button key={option.value} onClick={() => choose(option.value)} disabled={loading}>
            <span>{String.fromCharCode(65 + index)}</span>
            <b>{option.text}</b>
            <small>{loading ? "Calculando…" : "Seleccionar →"}</small>
          </button>
        )}
      </div>
      {error && <p className="legal-note" role="alert">{error}</p>}
    </section>

    <p className="privacy-copy">Tus respuestas adaptan la experiencia. Este pulso no es un diagnóstico psicológico.</p>
  </div>;
}
