import { useEffect, useRef, useState } from "react";
import { apiClient, type CourseModule, type Lesson } from "../services/apiClient";
import {
  getCompletedModuleCount,
  getCourseProgress,
  getLessonDuration,
  getModuleDuration,
  getModuleStatus,
} from "../learn/courseProgress";

const EMPTY_COMPLETED_LESSON_IDS = new Set<string>();

export function LearnView({ onPractice, onLessonComplete, completedLessonIds = EMPTY_COMPLETED_LESSON_IDS }: {
  onPractice: () => void;
  onLessonComplete?: (lessonId: string) => void;
  completedLessonIds?: ReadonlySet<string>;
}) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<CourseModule[]>([]);
  const [answer, setAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const completionReported = useRef(false);

  useEffect(() => {
    Promise.all([
      apiClient.getLessons(),
      apiClient.getCourse(),
    ])
      .then(([loadedLessons, modules]) => {
        const availableLessons = loadedLessons ?? [];
        setLessons(availableLessons);
        setLesson(availableLessons[0] ?? null);
        setCourse(modules ?? []);
      })
      .catch(() => setError("No pudimos cargar el contenido de aprendizaje."))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <div className="page narrow-page"><p role="alert">{error}</p></div>;
  if (isLoading) return <div className="page narrow-page"><p role="status">Cargando microlección…</p></div>;
  if (!lesson) return <div className="page narrow-page"><p role="status">No hay microlecciones disponibles.</p></div>;

  const completedModules = getCompletedModuleCount(course, completedLessonIds);
  const courseProgress = getCourseProgress(course, completedLessonIds);
  const lessonDuration = getLessonDuration(lesson);

  return <div className="page learn-page">
    <header className="page-heading split">
      <div>
        <p className="overline">CAMINO DE APRENDIZAJE · {course.length} MÓDULOS</p>
        <h1>{lesson.title}.</h1>
        <div className="lesson-meta">
          <div><span>Objetivo</span><strong>{lesson.objective}</strong></div>
          <div><span>Duración</span><strong>{lessonDuration === null ? "Duración no disponible" : `${lessonDuration} min`}</strong></div>
        </div>
      </div>
      <div className="lesson-progress glass-card">
        <div className="course-progress-heading"><span>PROGRESO DEL CAMINO</span><b>{courseProgress}%</b></div>
        <div
          className="meter"
          role="progressbar"
          aria-label="Progreso de aprendizaje"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={courseProgress}
        >
          <i style={{ width: `${courseProgress}%` }} />
        </div>
        <small>{completedModules} de {course.length} módulos</small>
      </div>
    </header>

    <section className="journey-grid" aria-label="Módulos del curso">
      {course.map((module, index) => {
        const status = getModuleStatus(module, lesson.id, completedLessonIds);
        const duration = getModuleDuration(module, lessons);
        const statusLabel = status === "completed" ? "Completado" : status === "current" ? "En curso" : "Pendiente";
        return <article className={`journey-card glass-card module-card ${index === 0 ? "featured" : ""} module-${status}`} key={module.id}>
          <div className="module-card-top">
            <span className="journey-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="module-status">{statusLabel}</span>
          </div>
          <h3>{module.name}</h3>
          <p>{module.objective}</p>
          <div className="module-details">
            <div><span>Duración</span><strong>{duration === null ? "Duración no disponible" : `${duration} min`}</strong></div>
            <div><span>Acción práctica</span><strong>{module.sandboxAction}</strong></div>
          </div>
          <small className="module-criterion">Criterio: {module.completionCriterion}</small>
        </article>;
      })}
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
        <button type="button" className="button primary full" onClick={() => {
          if (!completionReported.current) {
            completionReported.current = true;
            onLessonComplete?.(lesson.id);
          }
          onPractice();
        }} disabled={answer === null}>
          Practicar este concepto →
        </button>
        <small className="guide-disclaimer">{lesson.keyLearning}</small>
      </aside>
    </section>
  </div>;
}
