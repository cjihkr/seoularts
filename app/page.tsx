import RatingForm from "../components/RatingForm";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="brand">서울예대 연극과 특기 시연</div>
      </header>
      <main className="hero">
        <div className="card">
          <div className="eyebrow">관객 참여형</div>
          <h1>센테는<br />선한가요?</h1>
          <p className="lead">
            센테의 행동을 보고<br />
            세 가지 답변 중 하나를 선택해 주세요.
          </p>
          <RatingForm />
        </div>
      </main>
    </>
  );
}
