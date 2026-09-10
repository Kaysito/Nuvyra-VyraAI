import { describe, expect, it } from "vitest";
import {
  getExperienceLabel,
  getHorizonLabel,
  getObjectiveLabel,
  getPressureResponseLabel,
  getRiskDispositionLabel,
} from "./pulsePresentation";

describe("pulse presentation labels", () => {
  it.each([
    ["beginner", "Inicial"],
    ["intermediate", "Intermedia"],
    ["advanced", "Avanzada"],
  ] as const)("maps experience %s", (value, label) => {
    expect(getExperienceLabel(value)).toBe(label);
  });

  it.each([
    ["low", "Baja"],
    ["medium", "Media"],
    ["high", "Alta"],
  ] as const)("maps risk disposition %s", (value, label) => {
    expect(getRiskDispositionLabel(value)).toBe(label);
  });

  it.each([
    ["short", "Corto plazo"],
    ["medium", "Mediano plazo"],
    ["long", "Largo plazo"],
    ["unspecified", "Sin definir"],
  ] as const)("maps horizon %s", (value, label) => {
    expect(getHorizonLabel(value)).toBe(label);
  });

  it.each([
    ["preservation", "Conservación"],
    ["growth", "Crecimiento"],
    ["income", "Ingresos periódicos"],
    ["unspecified", "Sin definir"],
  ] as const)("maps objective %s", (value, label) => {
    expect(getObjectiveLabel(value)).toBe(label);
  });

  it.each([
    ["actNow", "Tenderías a actuar de inmediato"],
    ["checkThenAct", "Revisarías información y decidirías pronto"],
    ["pauseAndReview", "Prefieres revisar contexto antes de decidir"],
    ["unsure", "Aún no sabes cómo reaccionarías"],
  ] as const)("maps pressure response %s", (value, label) => {
    expect(getPressureResponseLabel(value)).toBe(label);
  });
});
