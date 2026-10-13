"use client";

import { useEffect, useState } from "react";
import { getMyVote, saveVote, type Answer } from "../lib/vote";

const answers: { value: Answer; label: string }[] = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
  { value: "unknown", label: "알 수 없음" },
];

export default function RatingForm() {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyVote()
      .then((vote) => {
        if (vote) {
          setAnswer(vote);
          setSubmitted(true);
        }
      })
      .catch(() => setError("평가 데이터를 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, []);

  const selectAnswer = (value: Answer) => {
    setAnswer(value);
    setError("");
  };

  const complete = answer !== null;

  async function submit() {
    if (!answer) return;
    setSaving(true);
    setError("");
    try {
      await saveVote(answer);
      setSubmitted(true);
    } catch {
      setError("오류가 발생했어요. 투표를 전송하지 못했어요.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="message">투표 시스템을 준비하고 있어요…</p>;

  return (
    <>
      <div className="answers" role="radiogroup" aria-label="투표 답변">
        {answers.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`answer ${answer === value ? "selected" : ""}`}
            onClick={() => selectAnswer(value)}
            aria-pressed={answer === value}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="actions">
        {!submitted && (
          <button className="primary" onClick={submit} disabled={!complete || saving}>
            {saving ? "저장 중…" : "평가하기"}
          </button>
        )}
        {submitted && <p className="message">투표가 완료되었어요.</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </>
  );
}
