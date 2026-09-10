import { useEffect, useRef, useState } from "react";
import {
  createPulseProfile,
  PULSE_ASSESSMENT_VERSION,
  PULSE_QUESTIONS,
  type PulseAnswers,
  type PulseProfile,
} from "./pulseModel";

export function PulseV1View({ onComplete }: { onComplete: (profile: PulseProfile) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PulseAnswers>>({});
  const completed = useRef(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const question = PULSE_QUESTIONS[step];

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    questionHeading.current!.focus();
  }, [step]);

  const choose = (value: PulseAnswers[keyof PulseAnswers]) => {
    if (completed.current) return;

    const nextAnswers = { ...answers, [question.dimension]: value } as PulseAnswers;
    if (step < PULSE_QUESTIONS.length - 1) {
      setAnswers(nextAnswers);
      setStep(step + 1);
      return;
    }

    completed.current = true;
    onComplete(createPulseProfile(nextAnswers));
  };

  return <div className="page pulse-page">
    <div className="pulse-header">
      <div>
        <p className="overline">PULSO INICIAL · MENOS DE 90 SEGUNDOS</p>
        <h1>Empecemos por tu perspectiva.</h1>
      </div>
      <strong aria-label={`Pregunta ${step + 1} de ${PULSE_QUESTIONS.length}`}>
        {step + 1}<small aria-hidden="true"> / {PULSE_QUESTIONS.length}</small>
      </strong>
    </div>
    <div
      className="progress-track"
      role="progressbar"
      aria-label="Progreso del cuestionario pulse-v1"
      aria-valuemin={1}
      aria-valuemax={PULSE_QUESTIONS.length}
      aria-valuenow={step + 1}
    >
      <span style={{ width: `${((step + 1) / PULSE_QUESTIONS.length) * 100}%` }} />
    </div>
    <section className="glass-card question-card" aria-labelledby="pulse-question-heading" data-assessment-version={PULSE_ASSESSMENT_VERSION}>
      <p className="micro-label">PREGUNTA {String(step + 1).padStart(2, "0")}</p>
      <h2 id="pulse-question-heading" ref={questionHeading} tabIndex={-1}>{question.question}</h2>
      <p>Elige la respuesta que más se acerque a tu perspectiva. Es una referencia inicial, no un diagnóstico psicológico.</p>
      <div className="answer-grid" role="group" aria-labelledby="pulse-question-heading">
        {question.options.map(option => <button
          key={option.value}
          type="button"
          aria-label={option.label}
          onClick={() => choose(option.value)}
        >
          <span aria-hidden="true">›</span>
          <b>{option.label}</b>
          <small>Seleccionar →</small>
        </button>)}
      </div>
    </section>
    <p className="privacy-copy">Tus respuestas adaptan la experiencia y permanecen como una referencia provisional.</p>
  </div>;
}
