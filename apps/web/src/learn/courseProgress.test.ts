import { describe, expect, it } from "vitest";
import type { CourseModule, Lesson } from "../services/apiClient";
import {
  findLessonForModule,
  getCompletedModuleCount,
  getCourseProgress,
  getLessonDuration,
  getModuleDuration,
  getModuleStatus,
} from "./courseProgress";

const lesson: Lesson = {
  id: "lesson.one",
  title: "Lección uno",
  objective: "Comprender el riesgo.",
  scenario: "Un escenario.",
  explanation: "Una explicación.",
  question: "¿Qué revisarías?",
  options: ["El plan", "El ruido"],
  feedback: ["Bien", "Revisa el contexto"],
  keyLearning: "El contexto importa.",
  estimatedMinutes: 4,
  completionAction: "Practicar.",
};

const moduleOne: CourseModule = {
  id: "module.one",
  name: "Módulo uno",
  objective: "Aprender.",
  lessonId: "lesson.one",
  completionCriterion: "Completar.",
  sandboxAction: "Practicar.",
};

const moduleTwo: CourseModule = { ...moduleOne, id: "module.two", lessonId: "lesson.two" };

describe("course progress helpers", () => {
  it("finds a lesson by the module lesson ID", () => {
    expect(findLessonForModule(moduleOne, [lesson])).toBe(lesson);
    expect(findLessonForModule(moduleTwo, [lesson])).toBeUndefined();
  });

  it("returns a valid lesson duration and a safe fallback for invalid data", () => {
    expect(getLessonDuration(lesson)).toBe(4);
    expect(getLessonDuration(undefined)).toBeNull();
    expect(getLessonDuration({ ...lesson, estimatedMinutes: Number.NaN })).toBeNull();
    expect(getLessonDuration({ ...lesson, estimatedMinutes: 0 })).toBeNull();
    expect(getModuleDuration(moduleOne, [lesson])).toBe(4);
    expect(getModuleDuration(moduleTwo, [lesson])).toBeNull();
  });

  it("counts completed modules and derives bounded progress", () => {
    expect(getCompletedModuleCount([], new Set())).toBe(0);
    expect(getCourseProgress([], new Set())).toBe(0);
    expect(getCourseProgress([moduleOne, moduleTwo], new Set())).toBe(0);
    expect(getCourseProgress([moduleOne, moduleTwo], new Set(["lesson.one"]))).toBe(50);
    expect(getCourseProgress([moduleOne, moduleTwo], new Set(["lesson.one", "lesson.two"]))).toBe(100);
    expect(getCourseProgress([moduleOne], new Set(["lesson.one", "lesson.extra"]))).toBe(100);
  });

  it("assigns completed, current and pending module states", () => {
    expect(getModuleStatus(moduleOne, "lesson.one", new Set(["lesson.one"]))).toBe("completed");
    expect(getModuleStatus(moduleOne, "lesson.one", new Set())).toBe("current");
    expect(getModuleStatus(moduleTwo, "lesson.one", new Set())).toBe("pending");
  });
});
