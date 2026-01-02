const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();
let master = ctx.createGain(); master.gain.value = 1.0; master.connect(ctx.destination);
let musicBus = ctx.createGain(); let sfxBus = ctx.createGain();
musicBus.gain.value = 1.0; sfxBus.gain.value = 1.0;
musicBus.connect(master); sfxBus.connect(master);
function resumeAudio(){ if(ctx.state === "suspended") ctx.resume(); }
function setMusicVol(v){ musicBus.gain.value = v; }

function tone(freq, dur=0.18, type="square", vol=0.22){
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(vol, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g); g.connect(sfxBus);
  o.start(); o.stop(ctx.currentTime + dur);
}
function noiseBurst(dur=0.12, vol=0.35){
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++) data[i] = (Math.random()*2-1) * (1 - i/bufferSize);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  src.buffer = buffer; g.gain.value = vol;
  src.connect(g); g.connect(sfxBus);
  src.start(); src.stop(ctx.currentTime + dur);
}

const ICONS = [
  {k:"🤖", f:[620,420], t:["square","square"]},
  {k:"💥", boom:true},
  {k:"🦄", f:[440,660,880], t:["sine","sine","triangle"]},
  {k:"😂", f:[740,740,520], t:["triangle","triangle","sine"]},
  {k:"👻", f:[320,520], t:["sine","triangle"]},
  {k:"🎮", f:[980,1200], t:["square","square"]},
  {k:"⚽", f:[220,120], t:["triangle","triangle"]},
  {k:"🍕", f:[900], t:["sine"]},
  {k:"🐸", f:[120,90], t:["square","square"]},
  {k:"😈", f:[180,110], t:["sawtooth","sawtooth"]},
  {k:"🌈", f:[262,330,392,523], t:["sine","sine","sine","sine"]},
  {k:"😎", f:[440,554,659], t:["sine","sine","sine"]},
  {k:"🦊", f:[800,1000], t:["triangle","triangle"]},
  {k:"🐶", f:[380,420], t:["square","square"]},
  {k:"🐱", f:[900,1200], t:["triangle","triangle"]},
  {k:"🐼", f:[250], t:["sine"]},
];
function sfxVol(){ return Number(sfxRange.value)/100; }
function playSfx(key){
  resumeAudio();
  const item = ICONS.find(x=>x.k===key);
  const v = sfxVol();
  if(!item) return;
  if(item.boom){
    noiseBurst(0.14, 0.45*v);
    tone(150,0.10,"sawtooth",0.30*v);
    tone(60,0.22,"triangle",0.26*v);
    return;
  }
  const freqs = item.f || [440];
  const types = item.t || ["square"];
  freqs.forEach((f, idx)=> setTimeout(()=> tone(f, 0.18, types[Math.min(idx, types.length-1)], 0.22*v), idx*70));
}

/* Music */
let musicOn=false, musicTimer=null, musicStep=0, musicStyle="arcade";
let bpm = 120;
const SCALE = {E3:165,G3:196,A3:220,B3:247,C4:262,D4:294,E4:330,G4:392,A4:440,B4:494,C5:523,D5:587,E5:659};
const PATTERNS = {
  arcade:{type:"square",seq:["E4","R","G4","R","A4","R","G4","R","E4","R","B3","R","C4","R","D4","R"]},
  techno:{type:"sawtooth",seq:["E3","E3","R","G3","R","A3","R","B3","R","A3","R","G3","R","E3","R","R"]},
  rock:{type:"triangle",seq:["E4","R","E4","R","G4","R","A4","R","B4","R","A4","R","G4","R","E4","R"]},
  countdown:{type:"sine",seq:["B4","A4","B4","E4","R","R","C5","B4","C5","B4","A4","R","C5","B4","C5","E4"]},
  cyber:{type:"sine",seq:["E3","R","G3","R","A3","R","B3","R","C4","R","B3","R","A3","R","G3","R"]}
};
function beatSec(){ return 60/bpm; }
function musicGain(){ return (Number(volRange.value)/100) * 0.9; }
function playMusicTick(){
  if(!musicOn) return;
  const pat = PATTERNS[musicStyle] || PATTERNS.arcade;
  const note = pat.seq[musicStep % pat.seq.length]; musicStep++;
  if(note !== "R"){
    const f = SCALE[note] || 220;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = pat.type;
    o.frequency.setValueAtTime(f, ctx.currentTime);
    g.gain.setValueAtTime(musicGain(), ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.connect(g); g.connect(musicBus);
    o.start(); o.stop(ctx.currentTime + 0.13);
  }
}
function startMusic(){
  resumeAudio();
  if(musicOn) return;
  musicOn=true; musicStep=0;
  const interval = ()=> Math.max(80, Math.round((beatSec()*1000)/2));
  const loop=()=>{ playMusicTick(); musicTimer=setTimeout(loop, interval()); };
  loop();
  musicBtn.textContent="MÚSICA: ON";
}
function stopMusic(){
  musicOn=false;
  if(musicTimer) clearTimeout(musicTimer);
  musicTimer=null;
  musicBtn.textContent="MÚSICA: OFF";
}
function toggleMusic(){ musicOn ? stopMusic() : startMusic(); }

/* Screens */
const screenHome=document.getElementById("screenHome");
const screenSettings=document.getElementById("screenSettings");
const screenGame=document.getElementById("screenGame");
function showScreen(name){
  [screenHome,screenSettings,screenGame].forEach(s=>s.classList.remove("active"));
  if(name==="home") screenHome.classList.add("active");
  if(name==="settings") screenSettings.classList.add("active");
  if(name==="game") screenGame.classList.add("active");
}
async function requestFullscreen(){
  try{
    const el=document.documentElement;
    if(!document.fullscreenElement && el.requestFullscreen) await el.requestFullscreen();
  }catch(e){}
}

/* UI refs */
const modeHome=document.getElementById("modeHome");
const bpmHome=document.getElementById("bpmHome");
const bestHome=document.getElementById("bestHome");
const homeMsg=document.getElementById("homeMsg");

const modeSel=document.getElementById("modeSel");
const modeVal=document.getElementById("modeVal");
const modeDesc=document.getElementById("modeDesc");
const customBox=document.getElementById("customBox");
const audioBox=document.getElementById("audioBox");

const respRange=document.getElementById("respRange");
const showRange=document.getElementById("showRange");
const livesRange=document.getElementById("livesRange");
const startScoreRange=document.getElementById("startScoreRange");
const penRange=document.getElementById("penRange");
const speedRange=document.getElementById("speedRange");

const respVal=document.getElementById("respVal");
const showVal=document.getElementById("showVal");
const livesVal=document.getElementById("livesVal");
const startScoreVal=document.getElementById("startScoreVal");
const penVal=document.getElementById("penVal");
const speedVal=document.getElementById("speedVal");

const strictBtn=document.getElementById("strictBtn");
const vibeBtn=document.getElementById("vibeBtn");

const styleSel=document.getElementById("styleSel");
const bpmRange=document.getElementById("bpmRange");
const bpmVal=document.getElementById("bpmVal");
const volRange=document.getElementById("volRange");
const volVal=document.getElementById("volVal");
const sfxRange=document.getElementById("sfxRange");
const sfxVal=document.getElementById("sfxVal");
const tapBtn=document.getElementById("tapBtn");

/* Game HUD */
const levelTxt=document.getElementById("levelTxt");
const livesTxt=document.getElementById("livesTxt");
const scoreTxt=document.getElementById("scoreTxt");
const timeTxt=document.getElementById("timeTxt");
const respTxt=document.getElementById("respTxt");
const progressTxt=document.getElementById("progressTxt");
const respFill=document.getElementById("respFill");
const gameMsg=document.getElementById("gameMsg");
const board=document.getElementById("board");

/* Navigation */
document.getElementById("goSettingsBtn").onclick=()=>{resumeAudio();showScreen("settings");};
document.getElementById("backHomeBtn").onclick=()=>{resumeAudio();showScreen("home");syncHome();};
document.getElementById("applyBtn").onclick=()=>{applyMode(modeSel.value,true);};
document.getElementById("playFromSettingsBtn").onclick=async()=>{applyMode(modeSel.value,true);await requestFullscreen();startGame();showScreen("game");};
document.getElementById("goGameBtn").onclick=async()=>{resumeAudio();await requestFullscreen();startGame();showScreen("game");};
document.getElementById("homeFsBtn").onclick=async()=>{resumeAudio();await requestFullscreen();homeMsg.textContent="Pantalla completa solicitada.";};
document.getElementById("repeatBtn").onclick=()=>{ if(gameOn && !locked) playSequence(); };
document.getElementById("exitBtn").onclick=()=> stopGame("Salir");

let strict=false, vibe=true;
strictBtn.onclick=()=>{ strict=!strict; strictBtn.textContent="STRICT: "+(strict?"ON":"OFF"); strictBtn.style.background = strict ? "#f59e0b" : "#334155"; };
vibeBtn.onclick=()=>{ vibe=!vibe; vibeBtn.textContent="VIBRA: "+(vibe?"ON":"OFF"); };
musicBtn.onclick=toggleMusic;

/* TAP BPM */
let tapTimes=[];
tapBtn.onclick=()=>{
  resumeAudio();
  const t=performance.now();
  tapTimes.push(t);
  tapTimes=tapTimes.filter(x=>t-x<2500);
  if(tapTimes.length>=2){
    const diffs=[];
    for(let i=1;i<tapTimes.length;i++) diffs.push(tapTimes[i]-tapTimes[i-1]);
    const avg=diffs.reduce((a,b)=>a+b,0)/diffs.length;
    const newBpm=Math.max(80,Math.min(180,Math.round(60000/avg)));
    bpmRange.value=String(newBpm);
    syncAudioLabels();
    if(musicOn){ stopMusic(); startMusic(); }
  }
};

function modeLabel(m){ return m==="easy"?"Fácil":m==="hard"?"Difícil":m==="expert"?"Experto":m==="god"?"Dios":m==="custom"?"Personalizado":"Normal"; }
function modeDescription(m){
  if(m==="easy") return "Secuencia lenta al inicio + mucho tiempo para responder.";
  if(m==="normal") return "Equilibrado: secuencia cómoda al inicio.";
  if(m==="hard") return "Más rápido y penalización mayor.";
  if(m==="expert") return "Rápido y STRICT por defecto.";
  if(m==="god") return "Ultra rápido (nivel Dios).";
  return "Tú decides todos los parámetros, incluido el tiempo de mostrar secuencia.";
}

let desiredMusicOn=false;
const PRESETS = {
  easy:   { respMs: 4500, showMs: 850, lives: 5, startScore: 90, basePenalty: 8,  speedPct: 1, strict:false, vibe:true, musicOn:false, bpm:110, style:"arcade", vol:100, sfx:100 },
  normal: { respMs: 3200, showMs: 750, lives: 3, startScore: 70, basePenalty: 12, speedPct: 2, strict:false, vibe:true, musicOn:false, bpm:120, style:"arcade", vol:100, sfx:100 },
  hard:   { respMs: 2400, showMs: 650, lives: 3, startScore: 65, basePenalty: 16, speedPct: 3, strict:false, vibe:true, musicOn:false, bpm:130, style:"rock",   vol:100, sfx:100 },
  expert: { respMs: 1800, showMs: 520, lives: 2, startScore: 60, basePenalty: 22, speedPct: 4, strict:true,  vibe:true, musicOn:false, bpm:150, style:"cyber",  vol:100, sfx:100 },
  god:    { respMs: 1300, showMs: 320, lives: 1, startScore: 55, basePenalty: 30, speedPct: 7, strict:true,  vibe:true, musicOn:false, bpm:170, style:"cyber",  vol:100, sfx:100 },
};

function applyMode(m, toast){
  const isCustom = (m==="custom");
  customBox.style.display = isCustom ? "block" : "none";
  audioBox.style.display  = isCustom ? "block" : "none";

  modeVal.textContent = modeLabel(m);
  modeDesc.textContent = modeDescription(m);

  if(!isCustom){
    const p = PRESETS[m] || PRESETS.normal;
    respRange.value = String(p.respMs);
    showRange.value = String(p.showMs);
    livesRange.value = String(p.lives);
    startScoreRange.value = String(p.startScore);
    penRange.value = String(p.basePenalty);
    speedRange.value = String(p.speedPct);

    strict = !!p.strict; vibe = !!p.vibe;
    strictBtn.textContent="STRICT: "+(strict?"ON":"OFF");
    strictBtn.style.background = strict ? "#f59e0b" : "#334155";
    vibeBtn.textContent="VIBRA: "+(vibe?"ON":"OFF");

    bpmRange.value = String(p.bpm);
    styleSel.value = p.style;
    volRange.value = String(p.vol);
    sfxRange.value = String(p.sfx);
    desiredMusicOn = !!p.musicOn;
  }

  syncCustomLabels();
  syncAudioLabels();
  syncHome();
  if(toast) homeMsg.textContent = "Aplicado: " + modeVal.textContent;
}

function syncCustomLabels(){
  respVal.textContent = respRange.value;
  showVal.textContent = showRange.value;
  livesVal.textContent = livesRange.value;
  startScoreVal.textContent = startScoreRange.value;
  penVal.textContent = penRange.value;
  speedVal.textContent = speedRange.value + "%";
}
function syncAudioLabels(){
  bpmVal.textContent = bpmRange.value;
  volVal.textContent = volRange.value + "%";
  sfxVal.textContent = sfxRange.value + "%";
  bpm = Number(bpmRange.value);
  musicStyle = styleSel.value;
  setMusicVol(musicGain());
  bpmHome.textContent = String(bpm);
}
[respRange,showRange,livesRange,startScoreRange,penRange,speedRange].forEach(el=> el.oninput = ()=> syncCustomLabels());
[bpmRange,volRange,sfxRange].forEach(el=> el.oninput = ()=>{ syncAudioLabels(); if(el===bpmRange && musicOn){ stopMusic(); startMusic(); } });
styleSel.onchange = ()=>{ musicStyle = styleSel.value; if(musicOn){ stopMusic(); startMusic(); } };
modeSel.onchange = ()=> applyMode(modeSel.value,false);

/* Home sync */
const BEST_KEY="best_score_icons_modes_v2";
let best = Number(localStorage.getItem(BEST_KEY) || "0");
function syncHome(){ modeHome.textContent = modeVal.textContent; bpmHome.textContent = String(bpm); bestHome.textContent = String(best); }

/* Board */
function renderBoard(){
  board.innerHTML="";
  ICONS.forEach(item=>{
    const d=document.createElement("div");
    d.className="card"; d.dataset.key=item.k;
    d.innerHTML = '<div class="emo">'+item.k+'</div><div class="lab">SFX</div>';
    d.addEventListener("pointerdown", ()=> onPress(item.k, d));
    board.appendChild(d);
  });
}
renderBoard();
function flash(el, ms=160){ el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"), ms); }
function vibrate(ms){ if(vibe && navigator.vibrate) navigator.vibrate(ms); }
function findCard(key){ return [...board.children].find(x=>x.dataset.key===key); }
function nowMs(){ return performance.now(); }
function wait(ms){ return new Promise(r=>setTimeout(r, ms)); }

/* Game */
let gameOn=false, locked=false;
let sequence=[], inputIndex=0, level=0, lives=0, score=0;
let startTime=0, timerRAF=null;
let respDeadline=0, respTotalMs=0;

function responseWindowMs(){ return Number(respRange.value); }
function showMsPerIcon(){ return Number(showRange.value); }
function stepShowMs(){
  const base = showMsPerIcon();
  const inc = Number(speedRange.value)/100;
  const factor = Math.max(0.50, 1 - inc*Math.max(0, level-1)); // nivel 1 sin aceleración
  return Math.max(220, Math.round(base * factor));
}
function penaltyForLevel(){ return Math.max(1, Number(penRange.value) * level); }
function setResponseTimer(){
  respTotalMs = responseWindowMs();
  respDeadline = nowMs() + respTotalMs;
  respTxt.textContent = (respTotalMs/1000).toFixed(1) + "s";
}
function uiGame(){
  levelTxt.textContent=String(level);
  livesTxt.textContent=String(lives);
  scoreTxt.textContent=String(score);
  progressTxt.textContent = gameOn ? (inputIndex + "/" + sequence.length) : "-";
}
function pickKey(){
  const unlock = Math.min(ICONS.length, 6 + Math.floor(level/2));
  const pool = ICONS.slice(0, unlock).map(x=>x.k);
  return pool[Math.floor(Math.random()*pool.length)];
}
async function playSequence(){
  if(!gameOn) return;
  resumeAudio();
  locked=true;
  gameMsg.textContent="Escucha la secuencia…";
  inputIndex=0;
  uiGame();
  await wait(320);
  const ms = stepShowMs();
  for(const key of sequence){
    const el=findCard(key);
    if(el) flash(el, Math.max(160, ms-70));
    playSfx(key);
    vibrate(8);
    await wait(ms);
  }
  locked=false;
  gameMsg.textContent="Tu turno.";
  setResponseTimer();
  uiGame();
}
async function nextLevel(){
  level++;
  sequence.push(pickKey());
  gameMsg.textContent="Nivel "+level+". Memoriza.";
  uiGame();
  await playSequence();
}
function startClock(){
  if(timerRAF) cancelAnimationFrame(timerRAF);
  const loop=()=>{
    const t=nowMs();
    timeTxt.textContent=((t-startTime)/1000).toFixed(1)+"s";
    if(gameOn && !locked && respDeadline>0){
      const left=Math.max(0, respDeadline-t);
      respFill.style.width=((left/respTotalMs)*100)+"%";
      if(left<=0){
        respDeadline=0;
        onFail("tiempo");
      }
    } else respFill.style.width="0%";
    timerRAF=requestAnimationFrame(loop);
  };
  loop();
}
function startGame(){
  resumeAudio();
  if(modeSel.value!=="custom"){ desiredMusicOn ? startMusic() : stopMusic(); }
  gameOn=true; locked=false;
  sequence=[]; inputIndex=0; level=0;
  lives=Number(livesRange.value);
  score=Number(startScoreRange.value);
  startTime=nowMs();
  uiGame();
  startClock();
  nextLevel();
}
function stopGame(reason){
  gameOn=false; locked=false; respDeadline=0;
  if(score>best){ best=score; localStorage.setItem(BEST_KEY,String(best)); }
  syncHome();
  showScreen("home");
  if(reason) homeMsg.textContent=reason;
}
function onFail(kind){
  const pen=penaltyForLevel();
  score=Math.max(0, score-pen);
  vibrate([40,40,40]);
  if(score===0){ stopGame("Has llegado a 0 puntos. Pierdes."); return; }
  if(strict){
    lives=Math.max(0, lives-1);
    if(lives===0){ stopGame("Sin vidas. Pierdes."); return; }
  }
  gameMsg.textContent = `❗ Fallo por ${kind}. -${pen} puntos. Repetimos nivel.`;
  playSequence();
}
function onPress(key, el){
  resumeAudio();
  if(!gameOn){ flash(el,160); playSfx(key); return; }
  if(locked) return;
  flash(el,160); playSfx(key); vibrate(6);
  if(nowMs()>respDeadline){ respDeadline=0; onFail("tiempo"); return; }
  if(key!==sequence[inputIndex]){ onFail("icono"); return; }
  score += 10 + Math.floor(level/2);
  if(score>best){ best=score; localStorage.setItem(BEST_KEY,String(best)); syncHome(); }
  inputIndex++;
  if(inputIndex>=sequence.length){
    gameMsg.textContent="✅ Bien. Siguiente nivel…";
    respDeadline=0;
    uiGame();
    setTimeout(()=>nextLevel(), 320);
    return;
  }
  setResponseTimer();
  uiGame();
}

/* init */
applyMode("normal", false);
syncCustomLabels();
syncAudioLabels();
syncHome();
