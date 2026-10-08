"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../lib/firebase";

type Scores = {
  survival: number;
  goodness: number;
  wealth: number;
  honor: number;
};

const defaultScores: Scores = {
  survival: 0,
  goodness: 0,
  wealth: 0,
  honor: 0,
};

function averageToPercent(total: number, count: number) {
  if (count === 0) return 0;
  return Math.round((total / (count * 5)) * 100);
}

function SurvivalCircle({ value }: { value: number }) {
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="survival">
      <svg
        className="survival-circle"
        width="280"
        height="280"
        viewBox="0 0 280 280"
      >
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="#252525"
          strokeWidth="18"
        />

        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 140 140)"
        />
      </svg>

      <div className="survival-value">
        <span>{value}</span>
        <small>%</small>
      </div>

      <div className="survival-label">생존력</div>
    </div>
  );
}

function StatusBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={{ width: "100%", marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          color: "#fff",
        }}
      >
        <span style={{ fontSize: "20px", fontWeight: 500 }}>
          {label}
        </span>

        <strong style={{ fontSize: "22px" }}>
          {value}%
        </strong>
      </div>

      <div
        style={{
          width: "100%",
          height: "18px",
          backgroundColor: "#333",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: "999px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const [scores, setScores] = useState<Scores>(defaultScores);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    const votesRef = ref(database, "votes");

    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setScores(defaultScores);
        setVoteCount(0);
        return;
      }

      const votes = Object.values(data) as Array<{
        scores?: {
          survival?: number;
          goodness?: number;
          wealth?: number;
          honor?: number;
        };
      }>;

      const totals = {
        survival: 0,
        goodness: 0,
        wealth: 0,
        honor: 0,
      };

      votes.forEach((vote) => {
        totals.survival += vote.scores?.survival ?? 0;
        totals.goodness += vote.scores?.goodness ?? 0;
        totals.wealth += vote.scores?.wealth ?? 0;
        totals.honor += vote.scores?.honor ?? 0;
      });

      const count = votes.length;

      setVoteCount(count);

      setScores({
        survival: averageToPercent(totals.survival, count),
        goodness: averageToPercent(totals.goodness, count),
        wealth: averageToPercent(totals.wealth, count),
        honor: averageToPercent(totals.honor, count),
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="statistics-page">
      <section className="statistics-container">
        <div className="title-area">
          <p className="eyebrow">SEOULARTS 특기</p>

          <h1>
            센테(슈이타)
            <br />
            능력치
          </h1>

          <p className="vote-count">
            현재 {voteCount}명의 평가
          </p>
        </div>

        <div className="stats-layout">
          <SurvivalCircle value={scores.survival} />

          <div className="status-list">
            <StatusBar
              label="선함"
              value={scores.goodness}
            />

            <StatusBar
              label="부유함"
              value={scores.wealth}
            />

            <StatusBar
              label="명예로움"
              value={scores.honor}
            />
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
          max-width: 1200px;
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

        .stats-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 100px;
          align-items: center;
        }

        .survival {
          position: relative;
          width: 280px;
          height: 330px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .survival-circle {
          position: absolute;
          top: 0;
          left: 0;
        }

        .survival-value {
          position: relative;
          margin-top: -5px;
          display: flex;
          align-items: baseline;
          justify-content: center;
        }

        .survival-value span {
          font-size: 68px;
          font-weight: 700;
          letter-spacing: -0.06em;
        }

        .survival-value small {
          font-size: 25px;
          margin-left: 4px;
        }

        .survival-label {
          position: relative;
          margin-top: 8px;
          font-size: 16px;
          letter-spacing: 0.15em;
        }

        .status-list {
          display: flex;
          flex-direction: column;
          gap: 38px;
        }

        .status {
          width: 100%;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .status-header span {
          font-size: 20px;
          font-weight: 500;
        }

        .status-header strong {
          font-size: 22px;
          font-weight: 600;
        }

        .status-track {
          width: 100%;
          height: 16px;
          background: #292929;
          border-radius: 100px;
          overflow: hidden;
        }

        .status-fill {
          height: 100%;
          background: #fff;
          border-radius: 100px;
          transition: width 0.8s ease;
        }

        @media (max-width: 800px) {
          .statistics-page {
            padding: 60px 25px;
          }

          .title-area {
            margin-bottom: 50px;
          }

          .stats-layout {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .survival {
            margin: 0 auto;
          }

          .status-list {
            gap: 30px;
          }
        }
      `}</style>
    </main>
  );
}
