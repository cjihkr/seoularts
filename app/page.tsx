import Link from "next/link";
import RatingForm from "../components/RatingForm";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="brand">SEOULARTS 특기</div>
        <Link className="stat-link" href="/statistics">STATISTICS</Link>
      </header>
      <main className="hero">
        <div className="card">
          <div className="eyebrow">AUDIENCE EVALUATION</div>
          <h1>센테(슈이타)를<br />평가해 주세요.</h1>
          <p className="lead">
            이 인물이 살아남기 위해 선택한 행동들을 보고<br />
            네 가지 능력치를 1점에서 5점 사이로 평가해 주세요.
          </p>
          <RatingForm />
        </div>
      </main>
    </>
  );
}
