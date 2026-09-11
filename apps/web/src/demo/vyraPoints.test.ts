import { describe, expect, it } from "vitest";
import {
  awardPoints,
  getPointsToNextLevel,
  getVyraLevel,
  getVyraLevelProgress,
  INITIAL_VYRA_POINTS_STATE,
} from "./vyraPoints";

describe("vyraPoints state", () => {
  it("starts at zero without awarded actions", () => {
    expect(INITIAL_VYRA_POINTS_STATE.points).toBe(0);
    expect(INITIAL_VYRA_POINTS_STATE.awardedActions).toEqual(new Set());
  });

  it("awards Pulse once", () => {
    const awarded = awardPoints(INITIAL_VYRA_POINTS_STATE, "pulse:completed", 50);
    const repeated = awardPoints(awarded, "pulse:completed", 50);

    expect(awarded.points).toBe(50);
    expect(awarded.awardedActions).toEqual(new Set(["pulse:completed"]));
    expect(repeated).toBe(awarded);
  });

  it("awards each lesson ID independently and does not duplicate one lesson", () => {
    const first = awardPoints(INITIAL_VYRA_POINTS_STATE, "lesson:one:completed", 25);
    const repeated = awardPoints(first, "lesson:one:completed", 25);
    const second = awardPoints(repeated, "lesson:two:completed", 25);

    expect(repeated.points).toBe(25);
    expect(second.points).toBe(50);
    expect(second.awardedActions).toEqual(new Set(["lesson:one:completed", "lesson:two:completed"]));
  });

  it("awards first position and first decision once", () => {
    const position = awardPoints(INITIAL_VYRA_POINTS_STATE, "practice:first-position", 10);
    const repeatedPosition = awardPoints(position, "practice:first-position", 10);
    const decision = awardPoints(repeatedPosition, "practice:first-decision", 15);
    const repeatedDecision = awardPoints(decision, "practice:first-decision", 15);

    expect(repeatedPosition.points).toBe(10);
    expect(repeatedDecision.points).toBe(25);
    expect(repeatedDecision.awardedActions.size).toBe(2);
  });

  it("ignores non-positive and non-finite amounts", () => {
    expect(awardPoints(INITIAL_VYRA_POINTS_STATE, "zero", 0)).toBe(INITIAL_VYRA_POINTS_STATE);
    expect(awardPoints(INITIAL_VYRA_POINTS_STATE, "negative", -10)).toBe(INITIAL_VYRA_POINTS_STATE);
    expect(awardPoints(INITIAL_VYRA_POINTS_STATE, "nan", Number.NaN)).toBe(INITIAL_VYRA_POINTS_STATE);
    expect(awardPoints(INITIAL_VYRA_POINTS_STATE, "infinite", Number.POSITIVE_INFINITY)).toBe(INITIAL_VYRA_POINTS_STATE);
  });

  it("supports the complete 100-point journey", () => {
    let state = INITIAL_VYRA_POINTS_STATE;
    state = awardPoints(state, "pulse:completed", 50);
    state = awardPoints(state, "lesson:lesson.volatility:completed", 25);
    state = awardPoints(state, "practice:first-position", 10);
    state = awardPoints(state, "practice:first-decision", 15);

    expect(state.points).toBe(100);
    expect(state.awardedActions.size).toBe(4);
  });

  it.each([
    [0, 1], [1, 1], [50, 1], [99, 1], [100, 2], [101, 2], [115, 2], [199, 2], [200, 3],
  ])("calculates level %s as %s", (points, expected) => {
    expect(getVyraLevel(points)).toBe(expected);
  });

  it.each([[0, 0], [1, 1], [50, 50], [99, 99], [100, 0], [101, 1], [115, 15], [199, 99], [200, 0]])
    ("calculates progress for %s points", (points, expected) => {
      expect(getVyraLevelProgress(points)).toBe(expected);
    });

  it.each([[0, 100], [50, 50], [99, 1], [100, 100], [115, 85], [199, 1], [200, 100]])
    ("calculates points remaining for %s points", (points, expected) => {
      expect(getPointsToNextLevel(points)).toBe(expected);
    });

  it("does not mutate the input state when awarding", () => {
    const input = { points: 50, awardedActions: new Set(["existing"]) };
    const snapshot = new Set(input.awardedActions);
    const output = awardPoints(input, "new", 25);

    expect(input.points).toBe(50);
    expect(input.awardedActions).toEqual(snapshot);
    expect(output).not.toBe(input);
    expect(output.awardedActions).not.toBe(input.awardedActions);
  });
});
