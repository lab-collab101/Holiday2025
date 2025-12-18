
const PASSCODE = "HOLIDAY2025";
const QUESTIONS = [
  {q:"Which country started the tradition of putting up a Christmas tree?", a:["France","Germany","England","Norway"], correct:1},
  {q:"What year was the first Christmas card sent?", a:["1823","1843","1863","1883"], correct:1},
  {q:"What popular holiday drink is also called ‘milk punch’?", a:["Eggnog","Hot Chocolate","Mulled Wine","Punch Royale"], correct:0},
  {q:"In The Twelve Days of Christmas, how many total gifts are given?", a:["144","254","364","512"], correct:2},
  {q:"Which reindeer’s name starts with the letter ‘B’?", a:["Blitzen","Bambi","Bruno","Bolt"], correct:0},
  {q:"What is the coldest continent on Earth?", a:["Antarctica","Europe","Asia","North America"], correct:0},
  {q:"What is the term for animals that sleep through the winter?", a:["Migration","Hibernation","Dormancy","Estivation"], correct:1},
  {q:"Which U.S. state is the snowiest on average?", a:["Alaska","Vermont","Colorado","Maine"], correct:1},
  {q:"What is the chemical formula for snow?", a:["CO₂","H₂O","NaCl","O₂"], correct:1},
  {q:"What is the shortest day of the year called?", a:["Equinox","Winter Solstice","Polar Night","Midwinter"], correct:1},
  {q:"In Home Alone, where are the McCallisters going on vacation?", a:["London","Paris","Rome","New York"], correct:1},
  {q:"Who played the Grinch in the 2000 live-action movie?", a:["Robin Williams","Jim Carrey","Mike Myers","Johnny Depp"], correct:1},
  {q:"What is the highest-grossing Christmas movie of all time?", a:["Home Alone","The Grinch (2018)","Elf","Love Actually"], correct:1},
  {q:"In Elf, what is the first rule in the Code of Elves?", a:["Spread Christmas cheer","Treat every day like Christmas","Sing loud for all to hear","Never stop believing"], correct:1},
  {q:"Which animated film features a train that takes children to the North Pole?", a:["Frozen","The Polar Express","Arthur Christmas","Klaus"], correct:1},
  {q:"What color are mistletoe berries?", a:["Red","White","Green","Blue"], correct:1},
  {q:"Which country is credited with creating eggnog?", a:["France","England","Germany","Italy"], correct:1},
  {q:"What is the most popular Christmas song of all time?", a:["Jingle Bells","White Christmas","Silent Night","All I Want for Christmas Is You"], correct:1},
  {q:"What traditional Christmas decoration is actually a parasitic plant?", a:["Holly","Ivy","Mistletoe","Poinsettia"], correct:2},
  {q:"Which holiday movie features the line ‘Every time a bell rings, an angel gets his wings’?", a:["Miracle on 34th Street","It’s a Wonderful Life","A Christmas Carol","Scrooged"], correct:1},
];

const $ = sel => document.querySelector(sel);
const startBtn = $('#startBtn');
const passcodeInput = $('#passcode');
const nameInput = $('#name');
const timerBar = $('#timerBar');
const timerText = $('#timerText');
const qCounter = $('#qCounter');
const scoreEl = $('#score');
const qText = $('#qText');
const answersEl = $('#answers');
const nextBtn = $('#nextBtn');
const endSummary = $('#endSummary');
const leaderboardList = $('#leaderboardList');
const playAgainBtn = $('#playAgainBtn');
const exportBtn = $('#exportBtn');
const musicToggle = $('#musicToggle');
const sfxToggle = $('#sfxToggle');
const timerSelect = $('#timerSelect');
const shuffleToggle = $('#shuffleToggle');

let order = [...Array(QUESTIONS.length).keys()];
let idx = 0;
let score = 0;
let seconds = 15;
let timerId = null;
let timeLeft = 15;
let awaiting = false;
let playerName = '';

let audioCtx; function ensureAudio(){ if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }
function beep(freq=880, dur=0.08, type='sine', volume=0.15){ if(!sfxToggle.checked) return; ensureAudio(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=volume; o.connect(g); g.connect(audioCtx.destination); o.start(); setTimeout(()=>o.stop(), dur*1000); }
function chord(freqs=[440,660,880], dur=0.35){ if(!sfxToggle.checked) return; ensureAudio(); const g=audioCtx.createGain(); g.gain.value=0.12; g.connect(audioCtx.destination); const oscs=freqs.map(f=>{const o=audioCtx.createOscillator(); o.type='triangle'; o.frequency.value=f; o.connect(g); return o;}); oscs.forEach(o=>o.start()); setTimeout(()=>oscs.forEach(o=>o.stop()), dur*1000); }
function buzz(){ beep(110,0.35,'square',0.18); }
function ding(){ chord([523.25,659.25,783.99],0.4); }
let musicInterval=null, musicOn=false; function startMusic(){ if(!musicToggle.checked||musicOn) return; ensureAudio(); musicOn=true; let flip=false; musicInterval=setInterval(()=>{ if(!musicOn){clearInterval(musicInterval);return;} beep(flip?440:392,0.15,'sine',0.08); flip=!flip; },500);} function stopMusic(){ musicOn=false; if(musicInterval){clearInterval(musicInterval); musicInterval=null;} }

const confettiCanvas = document.getElementById('confetti'); const ctx = confettiCanvas.getContext('2d'); let confettiRunning=false, confettiPieces=[]; function resizeCanvas(){ confettiCanvas.width=window.innerWidth; confettiCanvas.height=window.innerHeight; } window.addEventListener('resize', resizeCanvas); resizeCanvas(); function launchConfetti(){ confettiRunning=true; confettiPieces=[...Array(120)].map(()=>({ x:Math.random()*confettiCanvas.width, y:-10-Math.random()*100, s:2+Math.random()*4, c:["#e74c3c","#2ecc71","#f1c40f","#3498db"][Math.floor(Math.random()*4)], vx:(Math.random()-0.5)*2, vy:2+Math.random()*3, r:Math.random()*Math.PI })); (function anim(){ if(!confettiRunning) return; ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); for(const p of confettiPieces){ p.x+=p.vx; p.y+=p.vy; p.r+=0.03; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s); ctx.restore(); } if(confettiPieces.every(p=>p.y>confettiCanvas.height+20)){ confettiRunning=false; return; } requestAnimationFrame(anim); })(); }

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function setScreen(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); }

function startTimer(){ timeLeft=seconds; timerText.textContent=timeLeft; timerBar.style.transform='scaleX(1)'; if(timerId) clearInterval(timerId); timerId=setInterval(()=>{ timeLeft--; timerText.textContent=timeLeft; timerBar.style.transform=`scaleX(${Math.max(timeLeft/seconds,0)})`; if(sfxToggle.checked){ if(timeLeft<=5&&timeLeft>0) beep(900-(5-timeLeft)*60,0.06,'sine',0.12); if(timeLeft===0) buzz(); } if(timeLeft<=0){ clearInterval(timerId); timerId=null; lockAnswers(); nextBtn.disabled=true; setTimeout(()=>{ nextBtn.disabled=false; }, 500);} },1000); }
function stopTimer(){ if(timerId){ clearInterval(timerId); timerId=null; } }

function startGame(){ const code=passcodeInput.value.trim(); playerName=nameInput.value.trim()||'Player'; if(code!==PASSCODE){ buzz(); passcodeInput.classList.add('wrong'); setTimeout(()=>passcodeInput.classList.remove('wrong'),300); return; } seconds=parseInt(timerSelect.value,10)||15; order=[...Array(QUESTIONS.length).keys()]; if(shuffleToggle.checked) shuffle(order); idx=0; score=0; scoreEl.textContent=`Score: ${score}`; startMusic(); setScreen('screen-quiz'); loadQuestion(); }

function loadQuestion(){ awaiting=false; nextBtn.disabled=true; const qIndex=order[idx]; const obj=QUESTIONS[qIndex]; qText.textContent=obj.q; qCounter.textContent=`Q ${idx+1} / ${QUESTIONS.length}`; answersEl.innerHTML=''; obj.a.forEach((txt,i)=>{ const btn=document.createElement('button'); btn.className='answer'; btn.textContent=txt; btn.addEventListener('click',()=>selectAnswer(i,obj.correct,btn)); answersEl.appendChild(btn); }); startTimer(); }

function selectAnswer(choice, correctIdx, btn){ if(awaiting) return; awaiting=true; stopTimer(); const buttons=[...document.querySelectorAll('.answer')]; buttons.forEach(b=>b.disabled=true); if(choice===correctIdx){ btn.classList.add('correct'); ding(); launchConfetti(); score+=100+Math.max(0,timeLeft)*5; } else { btn.classList.add('wrong'); buzz(); buttons[correctIdx].classList.add('correct'); } scoreEl.textContent=`Score: ${score}`; nextBtn.disabled=false; }
function lockAnswers(){ const buttons=[...document.querySelectorAll('.answer')]; buttons.forEach(b=>b.disabled=true); buttons.forEach((b,i)=>{ if(i===QUESTIONS[order[idx]].correct) b.classList.add('correct'); }); awaiting=true; }

nextBtn.addEventListener('click',()=>{ if(idx<QUESTIONS.length-1){ idx++; loadQuestion(); } else { endGame(); } });

function endGame(){ stopTimer(); stopMusic(); setScreen('screen-end'); const accuracy=Math.round((score/(QUESTIONS.length*100))*100); endSummary.textContent=`${playerName}, you scored ${score} points. Accuracy ≈ ${accuracy}%`; saveLeaderboard(playerName,score); renderLeaderboard(); }

function saveLeaderboard(name,score){ const key='holiday_trivia_leaderboard_v1'; const list=JSON.parse(localStorage.getItem(key)||'[]'); list.push({name,score,t:Date.now()}); list.sort((a,b)=>b.score-a.score); if(list.length>20) list.length=20; localStorage.setItem(key,JSON.stringify(list)); }
function renderLeaderboard(){ const key='holiday_trivia_leaderboard_v1'; const list=JSON.parse(localStorage.getItem(key)||'[]'); leaderboardList.innerHTML=''; list.forEach((row,i)=>{ const li=document.createElement('li'); const date=new Date(row.t).toLocaleString(); li.textContent=`#${i+1} ${row.name} — ${row.score} pts (${date})`; leaderboardList.appendChild(li); }); }

playAgainBtn.addEventListener('click',()=>{ stopMusic(); setScreen('screen-start'); });
exportBtn.addEventListener('click',()=>{ const key='holiday_trivia_leaderboard_v1'; const list=JSON.parse(localStorage.getItem(key)||'[]'); const header='rank,name,score,timestamp
'; const rows=list.map((r,i)=>`${i+1},${r.name},${r.score},${new Date(r.t).toISOString()}`).join('
'); const blob=new Blob([header+rows],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='holiday_trivia_results.csv'; a.click(); URL.revokeObjectURL(url); });

startBtn.addEventListener('click', startGame);
musicToggle.addEventListener('change',()=>{ if(musicToggle.checked) startMusic(); else stopMusic(); });
sfxToggle.addEventListener('change',()=>{ if(!sfxToggle.checked) stopMusic(); });
passcodeInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter') startGame(); });
