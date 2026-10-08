import { get, onValue, ref, set, type Unsubscribe } from "firebase/database";
import { database } from "./firebase";

export type Scores = {
  survival: number;
  goodness: number;
  wealth: number;
  honor: number;
};

export const EMPTY_SCORES: Scores = {
  survival: 0,
  goodness: 0,
  wealth: 0,
  honor: 0,
};

const STORAGE_KEY = "sente-vote-id";

export function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export async function getMyVote(): Promise<Scores | null> {
  const id = getClientId();
  if (!id) return null;
  const snapshot = await get(ref(database, `votes/${id}`));
  if (!snapshot.exists()) return null;
  const value = snapshot.val();
  return value?.scores ?? null;
}

export async function saveVote(scores: Scores) {
  const id = getClientId();
  if (!id) throw new Error("브라우저 식별자를 만들 수 없습니다.");

  await set(ref(database, `votes/${id}`), {
    scores,
    updatedAt: Date.now(),
  });
}

export function subscribeToVotes(callback: (votes: Scores[]) => void): Unsubscribe {
  return onValue(ref(database, "votes"), (snapshot) => {
    const value = snapshot.val() ?? {};
    const votes = Object.values(value)
      .map((item) => (item as { scores?: Scores }).scores)
      .filter((scores): scores is Scores => Boolean(scores));
    callback(votes);
  });
}
