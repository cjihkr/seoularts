# Seoul Arts Poll Demo

서울예술대학교 입시 발표용으로 만든 간단한 투표 사이트입니다.

## 기능

- 로그인 없이 접속 가능
- 질문 하나가 먼저 노출됨
- 예 / 아니오 버튼으로 투표 가능
- 브라우저 localStorage를 이용해 중복 투표 방지
- Firebase Realtime Database와 연결하여 실시간 집계 가능

## 실행 방법

1. Firebase 프로젝트를 생성하고 Realtime Database를 활성화합니다.
2. 루트 디렉터리에 `.env.local` 파일을 생성합니다.
3. 아래 값을 넣고 프로젝트를 실행합니다.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. 개발 서버 실행

```bash
yarn dev
```

5. 브라우저에서 http://localhost:3000 으로 접속합니다.

## Firebase 데이터 구조

```json
{
  "polls": {
    "current": {
      "question": "서울예술대학교에 진학하는 것이 가장 의미 있는 선택이라고 생각하나요?",
      "yes": 12,
      "no": 8,
      "updatedAt": "2026-08-16T00:00:00.000Z"
    }
  }
}
```

> 환경 변수가 비어 있으면 앱은 Firebase 없이 로컬 데모 모드로 동작합니다.
