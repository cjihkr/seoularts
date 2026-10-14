"use client";

import { useEffect, useState } from "react";
import { subscribeToVotes, type Answer } from "../../lib/vote";

const answerLabels: Record<Answer, string> = {
  yes: "예",
  no: "아니오",
  unknown: "알 수 없음",
};

const answers: Answer[] = ["yes", "no", "unknown"];
const answerColors: Record<Answer, string> = {
  yes: "#ffffff",
  no: "#777777",
  unknown: "#333333",
};

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
  const chartBackground =
    voteCount === 0
      ? "#292929"
      : `conic-gradient(${answers
          .map((answer, index) => {
            const start = answers
              .slice(0, index)
              .reduce((total, item) => total + (counts[item] / voteCount) * 100, 0);
            const end = start + (counts[answer] / voteCount) * 100;
            return `${answerColors[answer]} ${start}% ${end}%`;
          })
          .join(", ")})`;

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

        <div className="result-layout" aria-label="투표 결과">
          <div
            className="chart"
            style={{ background: chartBackground }}
            role="img"
            aria-label={`전체 ${voteCount}표의 투표 결과`}
          >
            <div className="chart-center">
              <strong>{voteCount}</strong>
              <span>전체 투표</span>
            </div>
          </div>

          <div className="answer-list">
            {answers.map((answer) => {
              const count = counts[answer];
              const value = percentage(count, voteCount);

              return (
                <div className="answer-result" key={answer}>
                  <div className="answer-header">
                    <span>
                      <i style={{ background: answerColors[answer] }} />
                      {answerLabels[answer]}
                    </span>
                    <strong>{value}%</strong>
                  </div>
                  <p>{count}표</p>
                </div>
              );
            })}
          </div>
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

        .result-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 90px;
          align-items: center;
        }

        .chart {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          transition: background 0.8s ease;
        }

        .chart-center {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .chart-center strong {
          font-size: 56px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .chart-center span {
          margin-top: 8px;
          color: #888;
          font-size: 13px;
        }

        .answer-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .answer-result p {
          margin: 8px 0 0 28px;
          color: #888;
          font-size: 13px;
        }

        .answer-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .answer-header span {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 500;
        }

        .answer-header i {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .answer-header strong {
          font-size: 22px;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .statistics-page {
            padding: 60px 25px;
          }

          .title-area {
            margin-bottom: 50px;
          }

          .result-layout {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .chart {
            width: min(280px, 80vw);
            height: min(280px, 80vw);
            margin: 0 auto;
          }

          .chart-center {
            width: 165px;
            height: 165px;
          }
        }
      `}</style>
    </main>
  );
}
