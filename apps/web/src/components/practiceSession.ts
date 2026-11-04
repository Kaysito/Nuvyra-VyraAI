export type PracticeAssetSymbol = "BTC" | "ETH" | "SOL";
export type PracticeDecision = "wait24Hours" | "reviewEvidence" | "continueSale";
export type PracticeEventCode = "positionCreated" | "crashObserved" | "contextReviewed" | "decisionRecorded";
export type PracticeEvent = { code: PracticeEventCode; title: string; detail: string; points: number; observedAt: string };

export interface PracticeSession {
  boughtSymbol: PracticeAssetSymbol | null;
  crash: boolean;
  decision: PracticeDecision | null;
  events?: PracticeEvent[];
  vyraPoints?: number;
}

export const INITIAL_PRACTICE_SESSION: PracticeSession = {
  boughtSymbol: null,
  crash: false,
  decision: null,
  events: [],
  vyraPoints: 0,
};

export function addJourneyEvent(session: PracticeSession, event: Omit<PracticeEvent, "observedAt">): PracticeSession {
  const events = session.events ?? [];
  if (events.some(item => item.code === event.code)) return session;
  return {
    ...session,
    events: [...events, { ...event, observedAt: new Date().toISOString() }],
    vyraPoints: (session.vyraPoints ?? 0) + event.points,
  };
}

