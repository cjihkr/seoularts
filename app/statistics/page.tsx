"use client";

import { useEffect, useState } from "react";
import { subscribeToVotes, type Answer } from "../../lib/vote";

const answerLabels: Record<Answer, string> = {
  yes: "예",
  no: "아니오",
  unknown: "알 수 없음",
};

const answers: Answer[] = ["yes", "no", "unknown"];

function percentage(count: number, total: number) {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

export default function StatisticsPage() {
  const [counts, setCounts] = useState<Record<Answer, number>>({
    yes: 0,
    no: 0,
    unknown: 0,
  });

  useEffect(() => {
    return subscribeToVotes((votes) => {
      setCounts({
        yes: votes.filter((answer) => answer === "yes").length,
        no: votes.filter((answer) => answer === "no").length,
        unknown: votes.filter((answer) => answer === "unknown").length,
      });
    });
  }, []);

  const voteCount = counts.yes + counts.no + counts.unknown;

  return (
    <main className="statistics-page">
      <section className="statistics-container">
        <div className="title-area">
          <p className="eyebrow">서울예대 연극과 특기 시연</p>
          <h1>
            센테는
            <br />
            선한가요?
          </h1>
          <p className="vote-count">현재 {voteCount}명의 투표</p>
        </div>

        <div className="answer-list" aria-label="투표 결과">
          {answers.map((answer) => {
            const count = counts[answer];
            const value = percentage(count, voteCount);

            return (
              <div className="answer-result" key={answer}>
                <div className="answer-header">
                  <span>{answerLabels[answer]}</span>
                  <strong>{value}%</strong>
                </div>
                <div className="answer-track">
                  <div className="answer-fill" style={{ width: `${value}%` }} />
                </div>
                <p>{count}표</p>
              </div>
            );
          })}
        </div>
      </section>

      <style jsx>{`
        .statistics-page {
          min-height: 100vh;
          background: #111;
          color: #fff;
          padding: 80px 7vw;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .statistics-container {
          width: 100%;
          max-width: 900px;
        }

        .title-area {
          margin-bottom: 70px;
        }

        .eyebrow {
          margin: 0 0 18px;
          font-size: 12px;
          letter-spacing: 0.2em;
          opacity: 0.5;
        }

        h1 {
          margin: 0;
          font-size: clamp(48px, 7vw, 96px);
          line-height: 0.95;
          font-weight: 700;
          letter-spacing: -0.06em;
        }

        .vote-count {
          margin-top: 25px;
          font-size: 14px;
          opacity: 0.45;
        }

        .answer-list {
          display: flex;
          flex-direction: column;
          gap: 34px;
        }

        .answer-result p {
          margin: 10px 0 0;
          color: #888;
          font-size: 13px;
          text-align: right;
        }

        .answer-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .answer-header span {
          font-size: 20px;
          font-weight: 500;
        }

        .answer-header strong {
          font-size: 22px;
          font-weight: 600;
        }

        .answer-track {
          width: 100%;
          height: 16px;
          background: #292929;
          border-radius: 100px;
          overflow: hidden;
        }

        .answer-fill {
          height: 100%;
          background: #fff;
          border-radius: 100px;
          transition: width 0.8s ease;
        }

        @media (max-width: 600px) {
          .statistics-page {
            padding: 60px 25px;
          }

          .title-area {
            margin-bottom: 50px;
          }
        }
      `}</style>
    </main>
  );
}
