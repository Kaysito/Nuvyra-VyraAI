import { useEffect, useState } from "react";
import { apiClient, type CourseModule, type Lesson } from "../services/apiClient";

export function LearnView({ onPractice }: { onPractice: () => void }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<CourseModule[]>([]);
  const [answer, setAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiClient.getLessons(),
      apiClient.getCourse(),
    ])
      .then(([lessons, modules]) => {
        setLesson(lessons[0] ?? null);
        setCourse(modules ?? []);
      })
      .catch(() => setError("No pudimos cargar el contenido de aprendizaje."))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <div className="page narrow-page"><p role="alert">{error}</p></div>;
  if (isLoading) return <div className="page narrow-page"><p role="status">Cargando microlección…</p></div>;
  if (!lesson) return <div className="page narrow-page"><p role="status">No hay microlecciones disponibles.</p></div>;

  return <div className="page learn-page">
    <header className="page-heading split">
      <div>
        <p className="overline">CAMINO DE APRENDIZAJE · {course.length} MÓDULOS</p>
        <h1>{lesson.title}.</h1>
        <p>{lesson.objective} Tiempo estimado: {lesson.estimatedMinutes} minutos.</p>
      </div>
      <div className="lesson-progress glass-card">
        <span>PROGRESO DEL CAMINO</span>
        <b>20%</b>
        <div
          className="meter"
          role="progressbar"
          aria-label="Progreso de aprendizaje"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={20}
        >
          <i style={{ width: "20%" }} />
        </div>
      </div>
    </header>

    <section className="journey-grid" aria-label="Módulos del curso">
      {course.map((module, index) =>
        <article className={`journey-card glass-card ${index === 0 ? "featured" : ""}`} key={module.id}>
          <span className="journey-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{module.name}</h3>
          <p>{module.objective}</p>
          <small>{module.sandboxAction}</small>
        </article>
      )}
    </section>

    <section className="lesson-layout">
      <article className="glass-card lesson-story">
        <span className="lesson-index" aria-hidden="true">01</span>
        <p className="micro-label">ESCENARIO</p>
        <h2>{lesson.scenario}</h2>
        <p>{lesson.explanation}</p>
        <div className="chart-visual" aria-hidden="true"><span/><span/><span/><span/><span/><span/></div>
      </article>

      <aside className="glass-card lesson-choice">
        <p className="micro-label">TU DECISIÓN</p>
        <h3>{lesson.question}</h3>
        {lesson.options.map((item, index) =>
          <button
            type="button"
            aria-pressed={answer === index}
            className={answer === index ? "selected" : ""}
            key={item}
            onClick={() => setAnswer(index)}
          >
            <span aria-hidden="true">{String.fromCharCode(65 + index)}</span>{item}
          </button>
        )}
        {answer !== null &&
          <div className={`feedback ${answer === 1 ? "correct" : "neutral"}`} role="status" aria-live="polite">
            <strong>{answer === 1 ? "Buena perspectiva" : "Miremos un poco más amplio"}</strong>
            <p>{lesson.feedback[answer]}</p>
          </div>
        }
        <button type="button" className="button primary full" onClick={onPractice} disabled={answer === null}>
          Practicar este concepto →
        </button>
        <small className="guide-disclaimer">{lesson.keyLearning}</small>
      </aside>
    </section>
  </div>;
}
