import type { CourseModule, Lesson } from "../services/apiClient";

export type ModuleStatus = "completed" | "current" | "pending";

export function findLessonForModule(module: CourseModule, lessons: readonly Lesson[]) {
  return lessons.find(lesson => lesson.id === module.lessonId);
}

export function getLessonDuration(lesson: Lesson | null | undefined) {
  const minutes = lesson?.estimatedMinutes;
  return typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

export function getModuleDuration(module: CourseModule, lessons: readonly Lesson[]) {
  return getLessonDuration(findLessonForModule(module, lessons));
}

export function getCompletedModuleCount(course: readonly CourseModule[], completedLessonIds: ReadonlySet<string>) {
  return course.filter(module => completedLessonIds.has(module.lessonId)).length;
}

export function getCourseProgress(course: readonly CourseModule[], completedLessonIds: ReadonlySet<string>) {
  if (course.length === 0) return 0;
  const completed = getCompletedModuleCount(course, completedLessonIds);
  return Math.min(100, Math.round((completed / course.length) * 100));
}

export function getModuleStatus(
  module: CourseModule,
  activeLessonId: string | undefined,
  completedLessonIds: ReadonlySet<string>,
): ModuleStatus {
  if (completedLessonIds.has(module.lessonId)) return "completed";
  if (module.lessonId === activeLessonId) return "current";
  return "pending";
}
