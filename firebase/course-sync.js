import {isConfigured,createSync} from './firebase-sync.js';
const params=new URLSearchParams(location.search);
const teacher=params.has('admin'), review=params.has('view');
const status=document.getElementById('syncStatus'), login=document.getElementById('syncLogin');
const lock=document.getElementById('syncLock'), pdf=document.getElementById('syncPdf');
const message=document.getElementById('syncMessage');
let admin=false, user=null, connected=false, state=null;
const sync=createSync(window.FIREBASE_CONFIG,window.DECK_ID);
login.hidden=!teacher;
function paint(){
  window.courseSync.canNavigate=review || (connected && !!state && (teacher?admin:!state.locked));
  window.courseSync.canPrint=(teacher&&admin) || !!state?.pdf;
  document.documentElement.classList.toggle('no-pdf',!window.courseSync.canPrint);
  document.getElementById('printBtn').disabled=!window.courseSync.canPrint;
  status.textContent=review?'복습 모드':!connected?'동기화 연결 대기':teacher?(admin?'강사 연결':'강사 로그인 필요'):state?.locked?'강사 화면 따라가기':'자유 이동';
  lock.textContent='청중 잠금 '+(state?.locked?'ON':'OFF');
  pdf.textContent='PDF 허용 '+(state?.pdf?'ON':'OFF');
  lock.setAttribute('aria-pressed',String(!!state?.locked));
  pdf.setAttribute('aria-pressed',String(!!state?.pdf));
  login.textContent=user?'로그아웃':'Google 로그인';
  lock.hidden=pdf.hidden=!(teacher&&admin);
  lock.disabled=pdf.disabled=!connected;
  document.getElementById('navPrev').disabled=!window.courseSync.canNavigate || window.courseDeck.index===0;
  document.getElementById('navNext').disabled=!window.courseSync.canNavigate || window.courseDeck.index===window.courseDeck.total-1;
}
window.courseSync.onNavigate=async n=>{
  if(teacher&&admin) try{await sync.setSlide(n);}catch(e){message.textContent='전송 실패 · 연결 상태 확인';}
};
sync.onConnection(online=>{connected=online;paint();});
sync.onState(s=>{
  state=s;
  if(state && !review && (!teacher || admin) && (teacher || state.locked)) window.courseDeck.show(state.slide);
  if(!state)message.textContent='동기화 접근 오류 · 강사에게 확인';
  paint();
});
sync.onAdmin((allowed,currentUser)=>{
  admin=allowed;user=currentUser;
  message.textContent=teacher&&user&&!admin?'강사 등록 대기 · 계정 ID: '+user.uid:'';
  if(admin&&state&&!review)window.courseDeck.show(state.slide);
  paint();
});
sync.finishGoogleLogin().catch(e=>{message.textContent='로그인 실패 · '+e.code;});
login.addEventListener('click',async()=>{
  try{if(user)await sync.logout();else await sync.loginGoogle();}catch(e){message.textContent='로그인 실패 · '+e.code;}
});
lock.addEventListener('click',async()=>{
  try{await sync.setLock(!state?.locked);}catch(e){message.textContent='잠금 변경 실패 · 연결 상태 확인';}
});
pdf.addEventListener('click',async()=>{
  try{await sync.setPdf(!state?.pdf);}catch(e){message.textContent='PDF 변경 실패 · 연결 상태 확인';}
});
paint();
