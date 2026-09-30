import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getDatabase,ref,onValue,get,update,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const params=new URLSearchParams(location.search);
const teacher=params.has('admin');
const review=params.has('view');
const app=initializeApp(window.FIREBASE_CONFIG);
const db=getDatabase(app), auth=getAuth(app);
const stateRef=ref(db,'decks/'+window.DECK_ID+'/state');
let admin=false, connected=false, state=null;
const status=document.getElementById('syncStatus');
const login=document.getElementById('syncLogin');
const lock=document.getElementById('syncLock');
const message=document.getElementById('syncMessage');
login.hidden=!teacher; lock.hidden=true;
function paint(){
  window.courseSync.canNavigate=review || (connected && !!state && (teacher?admin:!state.locked));
  status.textContent=review?'복습 모드':!connected?'동기화 연결 대기':!state?'강의 시작 대기':teacher?(admin?'강사 연결':'강사 로그인 필요'):state.locked?'강사 화면 따라가기':'자유 이동';
  lock.textContent='청중 잠금 '+(state?.locked?'ON':'OFF');
  login.textContent=auth.currentUser?'로그아웃':'Google 로그인';
  lock.hidden=!(teacher&&admin);
  document.getElementById('navPrev').disabled=!window.courseSync.canNavigate || window.courseDeck.index===0;
  document.getElementById('navNext').disabled=!window.courseSync.canNavigate || window.courseDeck.index===window.courseDeck.total-1;
}
async function publish(values){
  if(!admin || !connected) throw new Error('강사 연결 필요');
  await update(stateRef,{...values,updatedAt:serverTimestamp()});
}
window.courseSync.onNavigate=async n=>{
  if(teacher&&admin) try{await publish({slide:n});}catch(e){message.textContent='전송 실패 · 연결 상태 확인';}
};
onValue(ref(db,'.info/connected'),snap=>{connected=snap.val()===true;paint();});
onValue(stateRef,snap=>{
  state=snap.val();
  if(state && !review && (!teacher || admin) && (teacher || state.locked)) window.courseDeck.show(state.slide);
  paint();
},()=>{state=null; message.textContent='동기화 접근 오류 · 강사에게 확인';paint();});
onAuthStateChanged(auth,async user=>{
  admin=false;
  if(teacher&&user){
    try{admin=(await get(ref(db,'admins/'+user.uid))).val()===true;}catch(e){admin=false;}
    message.textContent=admin?'':('강사 등록 대기 · 계정 ID: '+user.uid);
    if(admin && !state) try{await publish({slide:0,locked:true,pdf:true});}catch(e){message.textContent='강의 초기화 실패';}
  }else message.textContent='';
  paint();
});
login.addEventListener('click',async()=>{
  try{if(auth.currentUser) await signOut(auth);else await signInWithPopup(auth,new GoogleAuthProvider());}
  catch(e){message.textContent='로그인 실패 · '+e.code;}
});
lock.addEventListener('click',async()=>{
  try{await publish({locked:!state?.locked});}catch(e){message.textContent='잠금 변경 실패 · 연결 상태 확인';}
});
paint();
