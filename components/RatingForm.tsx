"use client";

import { useEffect, useState } from "react";
import { getMyVote, saveVote, type Scores } from "../lib/vote";

const items: { key: keyof Scores; label: string }[] = [
  { key: "survival", label: "생존력" },
  { key: "goodness", label: "선함" },
  { key: "wealth", label: "부유함" },
  { key: "honor", label: "명예로움" },
];

export default function RatingForm() {
  const [scores, setScores] = useState<Scores>({ survival: 0, goodness: 0, wealth: 0, honor: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyVote()
      .then((vote) => {
        if (vote) {
          setScores(vote);
          setSubmitted(true);
        }
      })
      .catch(() => setError("평가 데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  const setScore = (key: keyof Scores, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const complete = Object.values(scores).every((value) => value >= 1 && value <= 5);

  async function submit() {
    if (!complete) return;
    setSaving(true);
    setError("");
    try {
      await saveVote(scores);
      setSubmitted(true);
    } catch {
      setError("평가를 저장하지 못했습니다. Firebase Realtime Database 설정을 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="message">평가 시스템을 준비하고 있습니다…</p>;

  return (
    <>
      <div className="ratings">
        {items.map(({ key, label }) => (
          <div className="rating-row" key={key}>
            <div className="rating-name">{label}</div>
            <div className="stars" role="radiogroup" aria-label={`${label} 평가`}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`star ${scores[key] === value ? "selected" : ""}`}
                  onClick={() => setScore(key, value)}
                  aria-label={`${value}점`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="primary" onClick={submit} disabled={!complete || saving}>
          {saving ? "저장 중…" : submitted ? "다시 평가하기" : "평가하기"}
        </button>
        {submitted && <p className="message">평가가 완료되었습니다. 시연용 사이트에서는 점수를 다시 수정할 수 있습니다.</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </>
  );
}
