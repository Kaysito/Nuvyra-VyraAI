/**
 * Demo-only educational points. These values are not money, backend data, or
 * financial rules and may change with a future product definition.
 */
export const PULSE_COMPLETED = 50;
export const LESSON_COMPLETED = 25;
export const PRACTICE_POSITION_CREATED = 10;
export const PRACTICE_DECISION_COMPLETED = 15;

export interface VyraPointsState {
  points: number;
  awardedActions: ReadonlySet<string>;
}

export const INITIAL_VYRA_POINTS_STATE: VyraPointsState = {
  points: 0,
  awardedActions: new Set(),
};

export function awardPoints(state: VyraPointsState, actionId: string, amount: number): VyraPointsState {
  if (!Number.isFinite(amount) || amount <= 0) return state;
  if (state.awardedActions.has(actionId)) return state;

  const awardedActions = new Set(state.awardedActions);
  awardedActions.add(actionId);
  return { points: state.points + amount, awardedActions };
}

export function getVyraLevel(points: number) {
  return 1 + Math.floor(points / 100);
}

export function getVyraLevelProgress(points: number) {
  return points % 100;
}

export function getPointsToNextLevel(points: number) {
  return 100 - getVyraLevelProgress(points);
}
