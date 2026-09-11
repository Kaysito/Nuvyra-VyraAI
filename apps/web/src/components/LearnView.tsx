import { useEffect, useRef, useState } from "react";
import { apiClient, type CourseModule, type Lesson } from "../services/apiClient";
import {
  getCompletedModuleCount,
  getCourseProgress,
  getLessonDuration,
  getModuleDuration,
  getModuleStatus,
} from "../learn/courseProgress";
import { LESSON_COMPLETED } from "../demo/vyraPoints";

const EMPTY_COMPLETED_LESSON_IDS = new Set<string>();

type CompletedLessonIds = ReadonlySet<string> | readonly string[];

export function LearnView({
  onPractice,
  completedLessonIds = EMPTY_COMPLETED_LESSON_IDS,
  onComplete,
  onLessonComplete,
}: {
  onPractice: () => void;
  completedLessonIds?: CompletedLessonIds;
  onComplete?: (lessonId: string) => void;
  onLessonComplete?: (lessonId: string) => void;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseModule[]>([]);
  const [answer, setAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const completionReported = useRef(false);
  const completedLessonSet = new Set(completedLessonIds);
  const reportCompletion = onLessonComplete ?? onComplete;

  useEffect(() => {
    Promise.all([
      apiClient.getLessons(),
      apiClient.getCourse(),
    ])
      .then(([loadedLessons, modules]) => {
        const availableLessons = loadedLessons ?? [];
        setLessons(availableLessons);
        setSelectedLessonId(availableLessons[0]?.id ?? null);
        setCourse(modules ?? []);
      })
      .catch(() => setError("No pudimos cargar el contenido de aprendizaje."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    completionReported.current = false;
    setAnswer(null);
  }, [selectedLessonId]);

  if (error) return <div className="page narrow-page"><p role="alert">{error}</p></div>;
  if (isLoading) return <div className="page narrow-page"><p role="status">Cargando microlección…</p></div>;

  const lesson = lessons.find(item => item.id === selectedLessonId) ?? lessons[0] ?? null;
  if (!lesson) return <div className="page narrow-page"><p role="status">No hay microlecciones disponibles.</p></div>;

  const completedModules = getCompletedModuleCount(course, completedLessonSet);
  const courseProgress = getCourseProgress(course, completedLessonSet);
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
        const status = getModuleStatus(module, lesson.id, completedLessonSet);
        const duration = getModuleDuration(module, lessons);
        const statusLabel = status === "completed" ? "Completado" : status === "current" ? "En curso" : "Pendiente";
        return <article className={`journey-card glass-card module-card ${status === "current" ? "featured" : ""} module-${status}`} key={module.id}>
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
          <button type="button" className="text-button" aria-pressed={module.lessonId === lesson.id} onClick={() => setSelectedLessonId(module.lessonId)}>
            {completedLessonSet.has(module.lessonId) ? "Repasar módulo" : "Abrir módulo"} <span aria-hidden="true">→</span>
          </button>
        </article>;
      })}
    </section>

    <section className="lesson-layout">
      <article className="glass-card lesson-story">
        <span className="lesson-index" aria-hidden="true">{String(Math.max(0, course.findIndex(module => module.lessonId === lesson.id)) + 1).padStart(2, "0")}</span>
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
            reportCompletion?.(lesson.id);
          }
          onPractice();
        }} disabled={answer === null}>
          Practicar este concepto →
        </button>
        {completedLessonSet.has(lesson.id) && <div className="points-earned" role="status"><span aria-hidden="true">✦</span><strong>+{LESSON_COMPLETED} VyraPoints</strong><small>Microlección completada</small></div>}
        <small className="guide-disclaimer">{lesson.keyLearning}</small>
      </aside>
    </section>
  </div>;
}
