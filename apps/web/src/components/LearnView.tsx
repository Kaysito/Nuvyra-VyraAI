import { useEffect, useState } from "react";
import { apiClient, type CourseModule, type Lesson } from "../services/apiClient";

export function LearnView({ onPractice, completedLessonIds = [], onComplete = () => undefined }: { onPractice: () => void; completedLessonIds?: string[]; onComplete?: (lessonId: string) => void }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
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
        setLessons(lessons);
        setSelectedLessonId(lessons[0]?.id ?? null);
        setCourse(modules ?? []);
      })
      .catch(() => setError("No pudimos cargar el contenido de aprendizaje."))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <div className="page narrow-page"><p role="alert">{error}</p></div>;
  if (isLoading) return <div className="page narrow-page"><p role="status">Cargando microlección…</p></div>;
  const lesson = lessons.find(item => item.id === selectedLessonId) ?? lessons[0] ?? null;
  if (!lesson) return <div className="page narrow-page"><p role="status">No hay microlecciones disponibles.</p></div>;
  const completedModules = course.filter(module => completedLessonIds.includes(module.lessonId)).length;
  const progress = course.length === 0 ? 0 : Math.round(completedModules / course.length * 100);

  return <div className="page learn-page">
    <header className="page-heading split">
      <div>
        <p className="overline">CAMINO DE APRENDIZAJE · {course.length} MÓDULOS</p>
        <h1>{lesson.title}.</h1>
        <p>{lesson.objective} Tiempo estimado: {lesson.estimatedMinutes} minutos.</p>
      </div>
      <div className="lesson-progress glass-card">
        <span>PROGRESO DEL CAMINO</span>
        <b>{progress}%</b>
        <div
          className="meter"
          role="progressbar"
          aria-label="Progreso de aprendizaje"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>

    <section className="journey-grid" aria-label="Módulos del curso">
      {course.map((module, index) =>
        <article className={`journey-card glass-card ${module.lessonId === lesson.id ? "featured" : ""}`} key={module.id}>
          <span className="journey-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{module.name}</h3>
          <p>{module.objective}</p>
          <small>{module.sandboxAction}</small>
          <button type="button" className="text-button" aria-pressed={module.lessonId === lesson.id} onClick={() => { setSelectedLessonId(module.lessonId); setAnswer(null); }}>
            {completedLessonIds.includes(module.lessonId) ? "Repasar módulo" : "Abrir módulo"} <span aria-hidden="true">→</span>
          </button>
        </article>
      )}
    </section>

    <section className="lesson-layout">
      <article className="glass-card lesson-story">
        <span className="lesson-index" aria-hidden="true">{String(course.findIndex(module => module.lessonId === lesson.id) + 1).padStart(2, "0")}</span>
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
        <button type="button" className="button primary full" onClick={() => { onComplete(lesson.id); onPractice(); }} disabled={answer === null}>
          Practicar este concepto →
        </button>
        {completedLessonIds.includes(lesson.id) && <div className="points-earned" role="status"><span aria-hidden="true">✦</span><strong>+15 VyraPoints</strong><small>Microlección completada</small></div>}
        <small className="guide-disclaimer">{lesson.keyLearning}</small>
      </aside>
    </section>
  </div>;
}
