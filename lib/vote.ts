import { get, onValue, ref, set, type Unsubscribe } from "firebase/database";
import { database } from "./firebase";

export type Answer = "yes" | "no" | "unknown";

export const ANSWERS: Answer[] = ["yes", "no", "unknown"];

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

export async function getMyVote(): Promise<Answer | null> {
  const id = getClientId();
  if (!id) return null;
  const snapshot = await get(ref(database, `votes/${id}`));
  if (!snapshot.exists()) return null;
  const value = snapshot.val();
  return ANSWERS.includes(value?.answer) ? value.answer : null;
}

export async function saveVote(answer: Answer) {
  const id = getClientId();
  if (!id) throw new Error("브라우저 식별자를 만들 수 없습니다.");

  await set(ref(database, `votes/${id}`), {
    answer,
    updatedAt: Date.now(),
  });
}

export function subscribeToVotes(callback: (votes: Answer[]) => void): Unsubscribe {
  return onValue(ref(database, "votes"), (snapshot) => {
    const value = snapshot.val() ?? {};
    const votes = Object.values(value)
      .map((item) => (item as { answer?: unknown }).answer)
      .filter((answer): answer is Answer => ANSWERS.includes(answer as Answer));
    callback(votes);
  });
}
