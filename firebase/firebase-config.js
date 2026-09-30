/* Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹) → SDK 설정 및 구성 → "구성" 값을 그대로 붙여넣기
   이 값은 비밀번호가 아님(웹 앱에 공개되는 식별 정보) · 보안은 database.rules.json 규칙이 담당
   databaseURL 은 Realtime Database 화면 상단 주소 (예: https://프로젝트-default-rtdb.asia-southeast1.firebasedatabase.app) */
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCrh0L01eJoGCYPMJd4LhJrlRXGxHiu7Y4',
  authDomain: 'course-83c2e.firebaseapp.com',
  databaseURL: 'https://course-83c2e-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'course-83c2e',
  appId: '1:979238444116:web:5ded7dfb68c7bb0fdd61c1'
};

/* 강의마다 다른 이름 - 같은 프로젝트로 여러 강의 운영 가능 (영문·숫자·하이픈) */
window.DECK_ID = 'youtube-course-20261012';
