# 청중 동기화 설정 체크리스트

현재 프로젝트: `youtube-course` / `course-83c2e`. 아래 1~5번은 현재 프로젝트에서 설정 완료.

- [x] 1. Realtime Database: Firebase 콘솔 → 데이터베이스 및 스토리지 → Realtime Database → 데이터베이스 만들기 → 싱가포르 → 잠금 모드. 기존 데이터베이스가 있으면 생성 대신 해당 데이터베이스 열기.
- [x] 2. Authentication: 보안 → Authentication → 시작하기 → 로그인 방법 → Google 활성화 → 지원 이메일 선택 → 저장. 설정 → 승인된 도메인에 `codex-1008-lime.vercel.app` 등록. 이 강의는 Google 로그인 사용.
- [x] 3. 규칙: Realtime Database → 규칙 → 이 폴더의 `database.rules.json` 내용 붙여넣기 → 게시. 청중은 진행 정보 읽기만 가능, 등록된 강사만 쓰기 가능.
- [x] 4. admins: `slides.html?admin`에서 강사 Google 로그인 → Authentication → 사용자 → 해당 계정 UID 복사 → Realtime Database 데이터에서 `admins/복사한UID` 값을 boolean `true`로 추가. 문자열 `"true"`와 구분. 처음 등록 후 강사 화면 새로고침. 기존 데이터를 덮어쓰는 루트 JSON 가져오기 대신 하위 노드 추가 사용.
- [x] 5. 웹 앱: 프로젝트 개요 → 앱 추가 → 웹 → 앱 등록 → 프로젝트 설정 → 내 앱 → SDK 구성. `firebase-config.js`에 apiKey·authDomain·databaseURL·projectId·appId 입력. DECK_ID는 `youtube-course-20261012` 유지. 다른 덱 이름 사용 시 규칙의 덱 이름도 수정.
- [ ] 6. 수업 전 확인: 강사 화면 `slides.html?admin`과 청중 화면 `slides.html`을 서로 다른 창에서 열기 → 강사 이동 → 청중 이동 확인 → 잠금 ON/OFF 확인 → PDF 허용 ON/OFF 확인.

## 사용 방식

- 강사 입장: `https://codex-1008-lime.vercel.app/slides.html?admin`
- 청중 입장: `https://codex-1008-lime.vercel.app/slides.html`
- 자유 복습: `https://codex-1008-lime.vercel.app/slides.html?view`
- 잠금 ON: 청중 화면이 강사 진행을 따라감. OFF: 청중 자유 이동.
- PDF OFF: 청중과 복습 화면의 PDF 버튼·P 단축키 비활성화, 브라우저 인쇄 화면에서 슬라이드 제외. 강사는 PDF 저장 가능. 화면 캡처까지 차단하는 기능은 아님.
- 설정 전: 필수 설정값이 비었거나 대괄호 자리표시자이면 Firebase 초기화 없이 자유 이동·PDF 저장 가능.
- 설정 후 연결 실패: 동기화 오류 표시. 설정 전 모드로 자동 전환하지 않음.

공식 문서: https://firebase.google.com/docs/database/web/start · https://firebase.google.com/docs/auth/web/google-signin · https://firebase.google.com/docs/database/security
