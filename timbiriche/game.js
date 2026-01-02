(() => {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  const boardWrap = document.getElementById("boardWrap");
  const playHud = document.getElementById("playHud");
  const playActions = document.getElementById("playActions");
  const pauseBtn2 = document.getElementById("pauseBtn2");
  const settingsBtn2 = document.getElementById("settingsBtn2");
  const musicNameEl = document.getElementById("musicName");
  const playersGrid = document.getElementById("playersGrid");
  const achGrid = document.getElementById("achGrid");

  const modeSel = document.getElementById("modeSel");
  const playersSel = document.getElementById("playersSel");
  const turnModeCard = document.getElementById("turnModeCard");
  const turnModeSel = document.getElementById("turnModeSel");
  const cpuLvlCard = document.getElementById("cpuLvlCard");
  const cpuLevelEl = document.getElementById("cpuLevel");

  const themeSel = document.getElementById("themeSel");
  const colsEl = document.getElementById('cols');
  const rowsEl = document.getElementById('rows');
  const boardBtn = document.getElementById('boardBtn');
  const boardOverlay = document.getElementById('boardOverlay');
  const boardColsEl = document.getElementById('boardCols');
  const boardRowsEl = document.getElementById('boardRows');
  const boardApplyBtn = document.getElementById('boardApplyBtn');
  const boardCancelBtn = document.getElementById('boardCancelBtn');
  const clockEl = document.getElementById('clock');

  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const createBtn = document.getElementById('createBtn');

  const q25Btn = document.getElementById('q25Btn');
  const q50Btn = document.getElementById('q50Btn');
  const q75Btn = document.getElementById('q75Btn');

  const turnTextEl = document.getElementById('turnText');
  const progressText = document.getElementById("progressText");
  const msgEl = document.getElementById('msg');
  const turnCard = document.getElementById('turnCard');

  const shotBadgeBig = document.getElementById("shotBadgeBig");
  const shotClockEl = document.getElementById("shotClock");
  const shotTag = document.getElementById("shotTag");
  const shotDot = document.getElementById("shotDot");

  const safeTapEl = document.getElementById("safeTap");
  const loupeOnEl = document.getElementById("loupeOn");
  const soundOnEl = document.getElementById("soundOn");
  const safeTapToggle = document.getElementById("safeTapToggle");
  const loupeToggle = document.getElementById("loupeToggle");
  const soundToggle = document.getElementById("soundToggle");

  const overlay = document.getElementById('overlay');
  const winnerBadge = document.getElementById('winnerBadge');
  const arcadeReason = document.getElementById('arcadeReason');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const closeOverlayBtn = document.getElementById('closeOverlayBtn');
  const resultsGrid = document.getElementById("resultsGrid");

  const rankBody = document.getElementById("rankBody");
  const rankRefreshBtn = document.getElementById("rankRefreshBtn");
  const rankResetBtn = document.getElementById("rankResetBtn");

  const EMOJIS = ["💩","🐶","🐱","🦊","🐼","🐸","🦄","🐵","🦖","👻","🤖","😈","😂","😎","🥸","🍕","🍔","🍟","🍩","⚽","🏀","🎮","🎲","💥","🌈"];
  // ===== Panel Sonidos (integrado) =====
  const soundPanelBtn = document.getElementById("soundPanelBtn");
  const soundPanelOverlay = document.getElementById("soundPanelOverlay");
  const closeSoundPanelBtn = document.getElementById("closeSoundPanelBtn");
  const spPlayerPick = document.getElementById("spPlayerPick");
  const spEmojiGrid = document.getElementById("spEmojiGrid");
  const musicNowEl = document.getElementById("musicNow");
  const musicNow2El = document.getElementById("musicNow2");
  const spTestTurnBtn = document.getElementById("spTestTurnBtn");
  const spTestBeepBtn = document.getElementById("spTestBeepBtn");

  let spSelectedPlayer = 1;

  function setMusicLabel(name){
    if (musicNowEl) musicNowEl.textContent = name || "—";
    if (musicNow2El) musicNow2El.textContent = name || "—";
  }

  function openSoundPanel(){
    if (!soundPanelOverlay) return;
    soundPanelOverlay.classList.add("show");
    soundPanelOverlay.setAttribute("aria-hidden","false");
    buildSoundPanelUI();
  }
  function closeSoundPanel(){
    if (!soundPanelOverlay) return;
    soundPanelOverlay.classList.remove("show");
    soundPanelOverlay.setAttribute("aria-hidden","true");
  }

  function buildSoundPanelUI(){
    if (!spPlayerPick || !spEmojiGrid) return;
    spPlayerPick.innerHTML = "";
    // botones jugador
    const max = playersCount;
    for (let p=1; p<=max; p++){
      const b=document.createElement("button");
      const isCpu = (vsCPU && p===2);
      b.type="button";
      b.className = (p===spSelectedPlayer) ? "active" : "";
      const nm = isCpu ? "CPU" : (playerName[p] || ("Jugador "+p));
      const em = playerEmoji[p] || "🙂";
      b.innerHTML = `<span style="display:flex;align-items:center;gap:10px">
        <span class="dot" style="background:${COLORS[p]};width:10px;height:10px;border-radius:50%"></span>
        <span>${nm}</span>
      </span><span style="font-size:20px">${em}</span>`;
      b.addEventListener("click", ()=>{
        spSelectedPlayer = p;
        buildSoundPanelUI();
        ensureAudio();
        if (soundOnEl.checked) playEmojiSfx(playerEmoji[p] || em);
      });
      spPlayerPick.appendChild(b);
    }

    // grid emojis
    spEmojiGrid.innerHTML = "";
    for (const e of EMOJIS){
      const btn=document.createElement("button");
      btn.type="button";
      btn.className="emojiBtn";
      btn.textContent=e;
      btn.addEventListener("click", ()=>{
        ensureAudio();
        playEmojiSfx(e);

        // si hay jugador válido, asigna emoji (si no está bloqueado)
        const p=spSelectedPlayer;
        if (!playerInputs[p]) return;

        // no permitir cambiar si partida en marcha o si es CPU
        if ((started && !gameOver) || (vsCPU && p===2)) return;

        playerInputs[p].emojiSel.value = e;
        playerEmoji[p] = e;
        updateTopUI();
		buildSoundPanelUI();
      });
      spEmojiGrid.appendChild(btn);
    }
  }

  soundPanelBtn?.addEventListener("click", ()=>{ ensureAudio(); openSoundPanel(); });
  closeSoundPanelBtn?.addEventListener("click", closeSoundPanel);
  soundPanelOverlay?.addEventListener("click", (e)=>{ if (e.target===soundPanelOverlay) closeSoundPanel(); });

  spTestTurnBtn?.addEventListener("click", ()=>{ ensureAudio(); sTurn(); });
  spTestBeepBtn?.addEventListener("click", ()=>{ ensureAudio(); sShotBeep(); });


  function getCss(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  function setCss(v,val){ document.documentElement.style.setProperty(v,val); }

  let playersCount = 2;
  const MAX_PLAYERS = 4;
  const COLORS = { 1:getCss("--p1"), 2:getCss("--p2"), 3:getCss("--p3"), 4:getCss("--p4") };

  // CPU levels
  for (let i=1;i<=50;i++){
    const opt=document.createElement("option");
    opt.value=String(i); opt.textContent=String(i);
    if (i===20) opt.selected=true;
    cpuLevelEl.appendChild(opt);
  }

  // ===== Ranking storage =====
  const RANK_KEY = "timbiriche_rank_v2";
  function loadRank(){
    try{ return JSON.parse(localStorage.getItem(RANK_KEY)||"{}") || {}; }
    catch{ return {}; }
  }
  function saveRank(obj){ try{ localStorage.setItem(RANK_KEY, JSON.stringify(obj)); }catch{} }
  function normNick(s){ return (s||"").trim().slice(0,18); }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
  function updateRankTable(){
    const rk=loadRank();
    const arr=Object.entries(rk).map(([nick,d])=>({nick,...d}));
    arr.sort((a,b)=>(b.points||0)-(a.points||0));
    const top=arr.slice(0,10);
    rankBody.innerHTML = top.map((r,i)=>`
      <tr>
        <td>${i+1}</td>
        <td><b>${escapeHtml(r.nick)}</b></td>
        <td class="num"><b>${r.points||0}</b></td>
        <td class="num">${r.wins||0}</td>
        <td class="num">${r.games||0}</td>
      </tr>
    `).join("") || `<tr><td colspan="5" class="hint">Aún no hay partidas guardadas.</td></tr>`;
  }
  rankRefreshBtn.addEventListener("click", updateRankTable);
  rankResetBtn.addEventListener("click", ()=>{
    if (!confirm("¿Borrar TODO el ranking de este dispositivo?")) return;
    localStorage.removeItem(RANK_KEY);
    updateRankTable();
  });

  // ===== Audio =====
  let audioCtx=null;

  // música: mixer independiente
  let musicGain=null;
  let musicMaster=null; // compresor ligero opcional
  function ensureAudio(){
    if (!soundOnEl.checked) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // crear bus de música 1 vez
    if (!musicGain){
      musicGain = audioCtx.createGain();
      musicGain.gain.value = 0.18; // volumen música
      musicMaster = audioCtx.createDynamicsCompressor();
      musicGain.connect(musicMaster);
      musicMaster.connect(audioCtx.destination);
    }

    if (audioCtx.state==="suspended") audioCtx.resume().catch(()=>{});
  }

  function osc(freq, dur, type, gain, t0, slideTo=null){
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.type=type;
    o.frequency.setValueAtTime(freq,t0);
    if (slideTo!=null){
      o.frequency.exponentialRampToValueAtTime(Math.max(1,slideTo), t0+dur);
    }
    g.gain.setValueAtTime(gain,t0);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t0); o.stop(t0+dur);
  }
  function sfxPattern(parts){
    if (!soundOnEl.checked) return;
    ensureAudio(); if (!audioCtx) return;
    const t=audioCtx.currentTime;
    for (const p of parts){
      const at = t + (p.dt||0);
      osc(p.f||440, p.d||0.05, p.type||"square", p.g||0.03, at, p.to??null);
    }
  }

  // ====== MUSICA DE FONDO (3 MELODIAS) ======
  let currentMusic = null, musicRAF = null, nextNoteTime = 0, musicStep = 0;

  // notas suficientes para tus 3 canciones
  const freqs = {
    "B2":123.47,"C3":130.81,"C#3":138.59,"D3":146.83,"D#3":155.56,"E3":164.81,"F3":174.61,"F#3":185.00,"G3":196.00,"G#3":207.65,"A3":220.00,"A#3":233.08,"B3":246.94,
    "C4":261.63,"C#4":277.18,"D4":293.66,"D#4":311.13,"E4":329.63,"F4":349.23,"F#4":369.99,"G4":392.00,"G#4":415.30,"A4":440.00,"A#4":466.16,"B4":493.88,
    "C5":523.25,"C#5":554.37,"D5":587.33,"D#5":622.25,"E5":659.26,"F5":698.46,"F#5":739.99,"G5":783.99,"G#5":830.61,"A5":880.00,
    "R":0
  };

  const SONGS = {
    mario: ["E5","E5","R","E5","R","C5","E5","R","G5","R","R","R","G4","R","R","R","C5","R","R","G4","R","R","E4","R","R","A4","R","B4","R","A#4","A4","R","G4","E5","G5","A5","R","F5","G5","R","E5","C5","D5","B4","R","R","R","R","C5","C5","C5","R","C5","D5","E5","R","C5","A4","G4","R","R","R","R","R"],
    arcade: ["B4","E5","B4","G4","B4","E5","B4","G4","A4","D5","A4","F#4","A4","D5","A4","F#4","E4","E5","E4","E5","D4","D5","D4","D5","C4","C5","C4","C5","B3","B4","B3","B4","E4","G4","B4","E5","D5","B4","G4","D4","E4","G4","B4","E5","F#5","D5","B4","A4","A3","A4","A3","A4","G3","G4","G3","G4","F#3","F#4","F#3","F#4","B3","B3","C4","D4"],
    rock: ["E4","R","G4","A4","R","E4","R","G4","A#4","A4","E4","R","G4","A4","R","G4","E4","R","R","R","R","R","R","R","E4","G4","A4","B4","C5","B4","A4","G4","A4","A4","R","A4","R","A4","C5","A4","G4","G4","R","G4","R","G4","B4","G4","E4","E4","R","E4","R","E4","G4","E4","D4","D4","R","D4","R","B3","C4","D4"]
  };

  function musicScheduler(){
    if (!currentMusic || !soundOnEl.checked) return;
    if (!audioCtx || audioCtx.state !== "running") return;

    // tempo fijo; si quieres lo cambiamos luego
    const bpm = 132;
    const stepDur = 60 / bpm / 4; // semicorcheas

    while (nextNoteTime < audioCtx.currentTime + 0.12){
      const song = SONGS[currentMusic];
      const note = song[musicStep % song.length];
      const f = freqs[note] || 0;

      if (f > 0 && musicGain){
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();

        // timbre por canción
        o.type = (currentMusic === "rock") ? "sawtooth" : (currentMusic === "arcade" ? "square" : "triangle");
        o.frequency.setValueAtTime(f, nextNoteTime);

        // envolvente suave
        g.gain.setValueAtTime(0.0001, nextNoteTime);
        g.gain.exponentialRampToValueAtTime(0.20, nextNoteTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + stepDur * 0.95);

        o.connect(g);
        g.connect(musicGain);

        o.start(nextNoteTime);
        o.stop(nextNoteTime + stepDur);
      }

      nextNoteTime += stepDur;
      musicStep++;
    }

    musicRAF = requestAnimationFrame(musicScheduler);
  }

  function stopMusic(){
    currentMusic = null;
    setMusicLabel("—");
  setMusicLabel("—");
    if (musicRAF) cancelAnimationFrame(musicRAF);
    musicRAF = null;
  }

  function startRandomMusic(){
    if (!soundOnEl.checked) return;

    // IMPORTANTÍSIMO: asegurar audio y que esté "running" en el gesto del usuario
    ensureAudio();
    if (!audioCtx) return;

    // a veces resume tarda un poco; reintenta 1 tick si aún no está running
    if (audioCtx.state !== "running"){
      audioCtx.resume().then(()=> {
        if (audioCtx.state === "running") startRandomMusic();
      }).catch(()=>{});
      return;
    }

    stopMusic();
    const keys = Object.keys(SONGS);
    currentMusic = keys[(Math.random()*keys.length)|0];
    const MUSIC_TITLES = { mario:"Techno Mario", arcade:"Arcade Pulse", rock:"Retro Rock" };
    const baseKey = String(currentMusic).replace(/^a[_-]/,'');
    setMusicLabel(MUSIC_TITLES[baseKey] || MUSIC_TITLES[currentMusic] || baseKey);

    musicStep = 0;
    nextNoteTime = audioCtx.currentTime + 0.02;
    musicScheduler();
  }

  // Sonidos por emoji (sintetizados)
  const EMOJI_SFX = {
    "💩": () => sfxPattern([{f:120, d:0.4, type:"sawtooth", g:0.12, to:30},{dt:0.05, f:80, d:0.5, type:"sine", g:0.15, to:20},{dt:0.1, f:40, d:0.6, type:"triangle", g:0.1, to:10}]),
    "🦄": () => sfxPattern([{f:440, d:0.8, type:"sine", g:0.05, to:880},{dt:0.1, f:660, d:0.7, type:"sine", g:0.04, to:1320},{dt:0.2, f:880, d:0.9, type:"sine", g:0.03, to:1760},{dt:0.3, f:1320, d:1.2, type:"triangle", g:0.02, to:2000}]),
    "🤖": () => sfxPattern([{f:800, d:0.1, type:"square", g:0.05, to:200},{dt:0.12, f:1200, d:0.1, type:"square", g:0.05, to:400},{dt:0.24, f:1600, d:0.4, type:"square", g:0.03, to:100}]),
    "👻": () => sfxPattern([{f:300, d:1.5, type:"sine", g:0.04, to:600},{dt:0.2, f:350, d:1.8, type:"triangle", g:0.02, to:150}]),
    "💥": () => sfxPattern([{f:150, d:0.1, type:"sawtooth", g:0.2, to:10},{dt:0.02, f:60, d:1.2, type:"triangle", g:0.15, to:5},{dt:0.05, f:1000, d:0.1, type:"square", g:0.05, to:100}]),
    "🌈": () => sfxPattern([{f:261.63, d:2.0, type:"sine", g:0.05},{dt:0.1, f:329.63, d:1.8, type:"sine", g:0.04},{dt:0.2, f:392.00, d:1.6, type:"sine", g:0.03},{dt:0.3, f:523.25, d:2.2, type:"sine", g:0.02}]),
    "🐶": () => sfxPattern([{f:380, d:0.2, type:"square", g:0.08, to:420},{dt:0.1, f:320, d:0.3, type:"square", g:0.05, to:200}]),
    "🐱": () => sfxPattern([{f:900, d:0.4, type:"triangle", g:0.04, to:1200},{dt:0.2, f:1100, d:0.4, type:"triangle", g:0.03, to:800}]),
    "🐸": () => sfxPattern([{f:100, d:0.2, type:"square", g:0.1, to:50},{dt:0.25, f:100, d:0.2, type:"square", g:0.1, to:50}]),
    "😈": () => sfxPattern([{f:150, d:0.8, type:"sawtooth", g:0.06, to:40},{dt:0.1, f:100, d:1.0, type:"sawtooth", g:0.04, to:30}]),
    "😂": () => sfxPattern([{f:800, d:0.15, type:"triangle", g:0.06},{dt:0.2, f:800, d:0.15, type:"triangle", g:0.06},{dt:0.4, f:600, d:0.4, type:"sine", g:0.04}]),
    "😎": () => sfxPattern([{f:440, d:0.5, type:"sine", g:0.08, to:554},{dt:0.2, f:659, d:0.8, type:"sine", g:0.06}]),
    "🥸": () => sfxPattern([{f:180, d:0.4, type:"square", g:0.05},{dt:0.2, f:140, d:0.6, type:"square", g:0.05}]),
    "🍕": () => sfxPattern([{f:800, d:0.1, type:"sine", g:0.06, to:1600}]),
    "🍔": () => sfxPattern([{f:200, d:0.3, type:"triangle", g:0.1, to:50}]),
    "🍟": () => sfxPattern([{f:2000, d:0.1, type:"sine", g:0.05},{dt:0.05, f:1800, d:0.1, type:"sine", g:0.05}]),
    "🍩": () => sfxPattern([{f:500, d:0.3, type:"sine", g:0.08, to:1200}]),
    "⚽": () => sfxPattern([{f:200, d:0.4, type:"triangle", g:0.15, to:40}]),
    "🏀": () => sfxPattern([{f:300, d:0.3, type:"square", g:0.1, to:150}]),
    "🎮": () => sfxPattern([{f:1000, d:0.1, type:"square", g:0.06},{dt:0.1, f:1500, d:0.3, type:"square", g:0.04}]),
    "🎲": () => sfxPattern([{f:1200, d:0.05, type:"triangle", g:0.05},{dt:0.1, f:1000, d:0.05, type:"triangle", g:0.05}]),
    "🦊": () => sfxPattern([{f:800, d:0.2, type:"triangle", g:0.06, to:1000}]),
    "🐼": () => sfxPattern([{f:250, d:0.4, type:"sine", g:0.1}]),
    "🐵": () => sfxPattern([{f:900, d:0.1, type:"square", g:0.05},{dt:0.15, f:1200, d:0.1, type:"square", g:0.05}]),
    "🦖": () => sfxPattern([{f:150, d:1.0, type:"sawtooth", g:0.1, to:20},{dt:0.1, f:100, d:1.2, type:"square", g:0.05, to:10}]),
  };

  function playEmojiSfx(emoji){
    const fn = EMOJI_SFX[emoji];
    if (fn) fn();
    else sfxPattern([{f:880,d:0.05,type:"triangle",g:0.02}]);
  }

  // Sonidos generales
  const sClick=()=>sfxPattern([{f:820,d:0.04,type:"square",g:0.022}]);
  const sTurn=()=>sfxPattern([{f:1480,d:0.06,type:"triangle",g:0.03},{dt:0.07,f:1980,d:0.08,type:"triangle",g:0.03}]);
  const sShotBeep=()=>sfxPattern([{f:980,d:0.045,type:"square",g:0.03}]);
  const sPenalty=()=>sfxPattern([{f:120,d:0.08,type:"sawtooth",g:0.035,to:90},{dt:0.09,f:980,d:0.06,type:"square",g:0.025}]);
  const sGameOver=()=>sfxPattern([{f:220,d:0.10,type:"sawtooth",g:0.03},{dt:0.12,f:165,d:0.12,type:"sawtooth",g:0.03}]);

  // ===== helpers =====
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const fmt=(sec)=>{ const m=Math.floor(sec/60), s=sec%60; return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"); };
  const fmt2=(n)=>String(n).padStart(2,"0");
  const alpha=(color,a)=>{
    if (color.startsWith("#")){
      const r=parseInt(color.slice(1,3),16), g=parseInt(color.slice(3,5),16), b=parseInt(color.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }
    if (color.startsWith("rgb(")) return color.replace("rgb(","rgba(").replace(")", `,${a})`);
    return color;
  };
  const isArcade=()=>document.body.classList.contains("theme-arcade");
  const dotColor=()=> isArcade() ? "#ffffff" : "#000000";
  const neutralLineColor=()=> getCss("--neutralLineDark");

  // ===== Estado =====
  let rows=20, cols=20;
  // h/v: 0 vacío, 1/2 jugador, -1 neutro
  let h=[], v=[], owner=[], boxEmoji=[];
  let turn=1;
  let lastTurn=1;
  let sinceLast={1:0,2:0,3:0,4:0};
  let score={1:0,2:0,3:0,4:0};
  let timeLeft={1:300,2:300,3:300,4:300};
  let playerName={1:"",2:"",3:"",4:""};
  let playerEmoji={1:"💩",2:"🐶",3:"🦄",4:"😈"};

  // logros
  let penalties={1:0,2:0,3:0,4:0};
  let bestChain={1:0,2:0,3:0,4:0};
  let currentChain=0;
  let bestCloseMs={1:null,2:null,3:null,4:null};
  let chain3Count={1:0,2:0,3:0,4:0};
  let doubleCloseCount={1:0,2:0,3:0,4:0};
  let fastCloseCount={1:0,2:0,3:0,4:0};
  const FAST_CLOSE_MS=600;
  let lastMoveAt=0;

  // reloj / shotclock
  let clockStart=300;
  let timerId=null;
  let started=false, paused=false, gameOver=false, created=false;

  let gameElapsed=0;
  const shotClockMax=15, shotClockMin=8;
  let shotClockStart=15;
  let shotLeft=15;
  let lastShotBeep=null;

  let freezeUntil=0;
  let inputLockUntil=0;
  const INPUT_COOLDOWN_MS=500;

  // partículas (purpurina)
  let particles=[];

  // geometría
  let dpr=Math.max(1,Math.min(2, window.devicePixelRatio||1));
  let pad=28, spacing=28, boardW=0, boardH=0;
  let hover=null;

  // toque seguro
  let pendingEdge=null;
  const PENDING_MS=1200;

  // modo cpu
  let vsCPU=false;
  const CPU_PLAYER=2;
  function cpuLevel(){ return clamp(parseInt(cpuLevelEl.value,10)||20, 1, 50); }
  function isCpuTurn(){ return vsCPU && started && !paused && !gameOver && turn===CPU_PLAYER; }

  // CPU: resaltar la última línea que pone la CPU (parpadeo hasta 5s o hasta que juegue el humano)
  let cpuLastEdge = null;
  let cpuBlinkUntil = 0;
  let cpuBlinkRaf = null;
  function startCpuBlink(edge){
    cpuLastEdge = edge ? {type: edge.type, r: edge.r, c: edge.c} : null;
    cpuBlinkUntil = cpuLastEdge ? (performance.now() + 5000) : 0;
    if (cpuLastEdge && !cpuBlinkRaf) cpuBlinkRaf = requestAnimationFrame(cpuBlinkTick);
  }
  function clearCpuBlink(){ cpuLastEdge = null; cpuBlinkUntil = 0; }
  function cpuBlinkTick(){
    if (!cpuLastEdge || performance.now() >= cpuBlinkUntil || !started || gameOver){ cpuBlinkRaf = null; return; }
    draw();
    cpuBlinkRaf = requestAnimationFrame(cpuBlinkTick);
  }


  function randomTurnActive(){
  return (!vsCPU) && playersCount===4 && (turnModeSel && turnModeSel.value==="random");
}

function nextTurn(fromTurn=turn){
  const max = (vsCPU ? 2 : playersCount);

  // Turnos en orden (por defecto)
  if (!randomTurnActive()){
    const t = (fromTurn % max) + 1;
    lastTurn = t;
    return t;
  }

  // Turnos aleatorios (solo 4 jugadores PvP)
  const exclude = fromTurn;

  // Si alguien lleva 5 turnos sin jugar, forzarlo.
  const forced = [];
  for (let p=1;p<=max;p++){
    if (p!==exclude && (sinceLast[p]||0) >= 5) forced.push(p);
  }
  let candidates = forced.length ? forced : Array.from({length:max},(_,i)=>i+1).filter(p=>p!==exclude);

  // Seguridad: si por lo que sea queda vacío
  if (!candidates.length) candidates = Array.from({length:max},(_,i)=>i+1).filter(p=>p!==exclude);

  const t = candidates[(Math.random()*candidates.length)|0];

  // actualizar contadores
  for (let p=1;p<=max;p++){
    if (p===t) sinceLast[p]=0;
    else sinceLast[p]=(sinceLast[p]||0)+1;
  }

  lastTurn = t;
  return t;
}

  // ===== UI players =====
  let playerInputs={};

  function fillEmojiSelect(sel, def){
    sel.innerHTML="";
    for (const e of EMOJIS){
      const opt=document.createElement("option");
      opt.value=e; opt.textContent=e;
      sel.appendChild(opt);
    }
    sel.value=def;
  }

  function buildPlayersUI(){
    playersGrid.innerHTML="";
    playerInputs={};

    for (let p=1;p<=playersCount;p++){
      const card=document.createElement("div");
      card.className="card";
      card.id=`pCard${p}`;

      const dot=document.createElement("div");
      dot.className="dot";
      dot.style.background = COLORS[p];

      const left=document.createElement("div");
      left.style.flex="1";

      const lab=document.createElement("div");
      lab.className="label";
      lab.textContent=`Jugador ${p}`;

      const val=document.createElement("div");
      val.className="value";
      val.innerHTML=`
        <span id="nameLabel${p}">—</span> ·
        <span class="pill" id="emojiBadge${p}">${p===1?"💩":(p===2?"🐶":(p===3?"🦄":"😈"))}</span>
        · Cuadros: <span id="score${p}">0</span>
        · Tiempo: <span id="time${p}">00:00</span>
      `;
      left.appendChild(lab); left.appendChild(val);

      const right=document.createElement("div");
      right.style.display="grid";
      right.style.gap="8px";
      right.style.justifyItems="end";

      const nameInput=document.createElement("input");
      nameInput.type="text";
      nameInput.maxLength=14;
      nameInput.placeholder=`Jugador ${p}`;

      const emojiSel=document.createElement("select");
      fillEmojiSelect(emojiSel, p===1?"💩":(p===2?"🐶":(p===3?"🦄":"😈")));

      right.appendChild(nameInput);
      right.appendChild(emojiSel);

      card.appendChild(dot);
      card.appendChild(left);
      card.appendChild(right);
      playersGrid.appendChild(card);

      playerInputs[p]={ card, nameInput, emojiSel,
        nameLabel:()=>document.getElementById(`nameLabel${p}`),
        badge:()=>document.getElementById(`emojiBadge${p}`),
        scoreEl:()=>document.getElementById(`score${p}`),
        timeEl:()=>document.getElementById(`time${p}`)
      };

      nameInput.addEventListener("input", ()=>updateTopUI());
      emojiSel.addEventListener("change", ()=>{
        ensureAudio();
        playEmojiSfx(emojiSel.value); // probar sonido al elegir
        updateTopUI();
      });
    }

    buildAchievementsUI();
    updateTopUI();
  }

  function buildAchievementsUI(){
    achGrid.innerHTML="";
    for (let p=1;p<=playersCount;p++){
      const box=document.createElement("div");
      box.className="achCard";
      box.innerHTML=`
        <div class="achHead">
          <div class="achName" style="color:${COLORS[p]}">
            <span id="achName${p}">Jugador ${p}</span> <span id="achEmoji${p}">🙂</span>
          </div>
          <div class="badge">#${p}</div>
        </div>

        <div class="achBadges" style="margin-bottom:8px">
          <div class="badge">Máx cadena: <b id="achChain${p}">0</b></div>
          <div class="badge">Mejor cierre: <b id="achClose${p}">—</b></div>
          <div class="badge">Penalizaciones: <b id="achPen${p}">0</b></div>
        </div>

        <div class="achBadges">
          <div class="badge gold" id="bChain3${p}" style="display:none">Cadena x3+</div>
          <div class="badge neon" id="bDouble${p}" style="display:none">Doble cierre</div>
          <div class="badge hot" id="bFast${p}" style="display:none">Cierre rápido</div>
          <div class="badge" id="bChain3C${p}" style="display:none">Cadena x3+: <b id="cChain3${p}">0</b></div>
          <div class="badge" id="bDoubleC${p}" style="display:none">Doble cierre: <b id="cDouble${p}">0</b></div>
          <div class="badge" id="bFastC${p}" style="display:none">Cierre rápido: <b id="cFast${p}">0</b></div>
        </div>
      `;
      achGrid.appendChild(box);
    }
  }

  function namesOk(){
    if (vsCPU){
      const n1=(playerInputs[1].nameInput.value||"").trim();
      return n1.length>0;
    }
    for (let p=1;p<=playersCount;p++){
      const n=(playerInputs[p].nameInput.value||"").trim();
      if (!n) return false;
    }
    return true;
  }
  function syncPlayerDataFromUI(){
    for (let p=1;p<=playersCount;p++){
      playerName[p]=(playerInputs[p].nameInput.value||"").trim();
      playerEmoji[p]=playerInputs[p].emojiSel.value;
    }
    if (vsCPU){
      playerName[2]="CPU";
      playerEmoji[2]=playerInputs[2].emojiSel.value || "🤖";
    }
  }
  function lockEmojiWhileRunning(){
    const lock = started && !gameOver;
    for (let p=1;p<=playersCount;p++){
      const alwaysLock = (vsCPU && p===2);
      playerInputs[p].emojiSel.disabled = lock || alwaysLock;
    }
  }
  function syncToggleStyles(){
    safeTapToggle.classList.toggle("on", !!safeTapEl.checked);
    loupeToggle.classList.toggle("on", !!loupeOnEl.checked);
    soundToggle.classList.toggle("on", !!soundOnEl.checked);
  }

  function setTurnBorder(){
    const border = (started && !gameOver) ? COLORS[turn] : (isArcade() ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.10)");
    setCss("--turnBorder", border);
    const glow = (started && !gameOver) ? alpha(COLORS[turn], isArcade()?0.70:0.22) : "rgba(0,0,0,0)";
    setCss("--turnGlow", glow);

    const blinking = started && !paused && !gameOver && (shotLeft <= 5 && shotLeft >= 1);
    boardWrap.classList.toggle("warnBlink", blinking);
  }

  function styleCardForTurn(card, active, color){
    card.style.borderColor=""; card.style.background=""; card.style.color="";
    const label=card.querySelector(".label");
    if (label) label.style.color="";
    if (!active) return;

    card.style.borderColor=color;
    if (isArcade()){
      card.style.background=`linear-gradient(180deg, ${alpha(color,0.24)}, rgba(0,0,0,.30))`;
      card.style.color="#fff";
      if (label) label.style.color="rgba(255,255,255,.78)";
      card.style.boxShadow=`0 0 22px ${alpha(color,0.16)}, 0 0 0 3px rgba(255,255,255,.10) inset`;
    } else {
      card.style.background=alpha(color,0.16);
      card.style.boxShadow=`0 0 0 3px ${alpha(color,0.10)} inset`;
    }
  }

  function updateShotUI(){
    shotBadgeBig.style.display = (started && !gameOver) ? "" : "none";
    shotClockEl.textContent=String(shotLeft);
    shotTag.textContent=`${shotClockStart}s`;
    shotDot.style.background = COLORS[turn];
    shotDot.style.boxShadow = `0 0 12px ${alpha(COLORS[turn], .55)}`;
    if (started && !gameOver){
      const col=COLORS[turn];
      shotBadgeBig.style.borderColor=col;
      shotBadgeBig.style.background = isArcade()
        ? `linear-gradient(180deg, ${alpha(col,0.22)}, rgba(0,0,0,.22))`
        : alpha(col,0.12);
    }
    progressText.textContent = started ? `Shot-clock: ${shotClockStart}s (mínimo ${shotClockMin}s)` : `Shot-clock: ${shotClockStart}s (no iniciado)`;
  }

  
  function renderPlayHud(){
    if (!playHud) return;
    const playing = started && !gameOver;
    document.body.classList.toggle("playing", playing);
    if (!playing){
      playHud.innerHTML = "";
      return;
    }

    const parts=[];

    // Shot-clock separado (no va dentro de tarjetas de jugador)
    const activeCol = COLORS[turn] || "#fff";
    const activeNm  = (playerName[turn] || `Jugador ${turn}`);
    const warn = (shotLeft <= 5 && shotLeft >= 1);
    parts.push(`
      <div class="shotHudCard ${warn?"warn":""}" style="--pcol:${activeCol}">
        <div class="shotHudLabel">TURNO</div>
        <div class="shotHudMain"><span class="shotHudSec">${shotLeft}</span><span class="shotHudS">s</span></div>
        <div class="shotHudSub">${activeNm}</div>
      </div>
    `);

    for (let p=1;p<=playersCount;p++){
      const col = COLORS[p];
      const on = (turn===p);
      const nm = (playerName[p]||`Jugador ${p}`);
      const em = (playerEmoji[p]||"🙂");
      const sc = score[p]||0;
      const tl = fmt(timeLeft[p]||0);
      const shot = "";

      parts.push(`
        <div class="pHudCard ${on?"active":""}" style="--pcol:${col}">
                    <div class="pHudLeft">
            <div class="pHudDot" style="background:${col}; box-shadow:0 0 18px ${alpha(col,0.35)}"></div>
            <div>
              <div class="pHudName">${nm} <span class="pill" style="padding:3px 8px; font-weight:950;">${em}</span></div>
              <div class="pHudSub">${on ? "TU TURNO" : "—"}</div>
            </div>
          </div>
          <div class="pHudRight">
            <div class="pHudScore" style="color:${isArcade() ? "#fff" : "#111827"}">${String(sc).padStart(2,"0")}</div>
            <div class="pHudTime">${tl}</div>
          </div>
        </div>
      `);
    }
    playHud.innerHTML = parts.join("");
  }


function updateAchievementsUI(){
    for (let p=1;p<=playersCount;p++){
      document.getElementById(`achName${p}`).textContent = playerName[p] || `Jugador ${p}`;
      document.getElementById(`achEmoji${p}`).textContent = playerEmoji[p] || "🙂";
      document.getElementById(`achChain${p}`).textContent = String(bestChain[p]||0);

      const ms=bestCloseMs[p];
      document.getElementById(`achClose${p}`).textContent = (ms==null) ? "—" : (ms/1000).toFixed(1)+"s";
      document.getElementById(`achPen${p}`).textContent = String(penalties[p]||0);

      const c3=chain3Count[p]||0, dc=doubleCloseCount[p]||0, fc=fastCloseCount[p]||0;
      document.getElementById(`bChain3${p}`).style.display = c3>0 ? "" : "none";
      document.getElementById(`bDouble${p}`).style.display = dc>0 ? "" : "none";
      document.getElementById(`bFast${p}`).style.display = fc>0 ? "" : "none";
      document.getElementById(`bChain3C${p}`).style.display = c3>0 ? "" : "none";
      document.getElementById(`bDoubleC${p}`).style.display = dc>0 ? "" : "none";
      document.getElementById(`bFastC${p}`).style.display = fc>0 ? "" : "none";
      if (c3>0) document.getElementById(`cChain3${p}`).textContent=String(c3);
      if (dc>0) document.getElementById(`cDouble${p}`).textContent=String(dc);
      if (fc>0) document.getElementById(`cFast${p}`).textContent=String(fc);
    }
  }

  function updateTopUI(){
    syncPlayerDataFromUI();

    const ok = namesOk();
    createBtn.disabled = !ok;
    startBtn.disabled = !ok;
    pauseBtn.disabled = !started || gameOver;

    if (!created) startBtn.textContent = "Empezar";
    else if (!started && !gameOver) startBtn.textContent = "Empezar";
    else if (started && !gameOver) startBtn.textContent = "En juego";
    else startBtn.textContent = "Empezar";


    for (let p=1;p<=playersCount;p++){
      const on = started && !gameOver && turn===p;
      playerInputs[p].card.classList.toggle("activeTurn", on);
      styleCardForTurn(playerInputs[p].card, on, COLORS[p]);
      playerInputs[p].nameLabel().textContent = playerName[p] || "—";
      playerInputs[p].badge().textContent = playerEmoji[p];
      playerInputs[p].scoreEl().textContent = score[p] || 0;
      playerInputs[p].timeEl().textContent = fmt(timeLeft[p] || 0);
    }
    styleCardForTurn(turnCard, started && !gameOver, COLORS[turn]);
    pauseBtn.textContent = paused ? "Reanudar" : "Pausa";

    if (!ok){
      msgEl.textContent = vsCPU ? "Escribe tu nombre y elige emojis." : `Escribe los nombres de los ${playersCount} jugadores y elige emojis.`;
    } else if (!created){
      msgEl.innerHTML='Pulsa <b>Crear</b> para generar el tablero.';
    } else if (!started && !gameOver){
      msgEl.innerHTML='Pulsa <b>Iniciar</b> para empezar.';
    }

    syncToggleStyles();
    lockEmojiWhileRunning();
    updateShotUI();
    setTurnBorder();
    updateAchievementsUI();
    renderPlayHud();

    // Turnos aleatorios: solo 4 jugadores PvP
    if (turnModeCard){
      const show = (!vsCPU) && playersCount===4;
      turnModeCard.style.display = show ? "" : "none";
      if (!show && turnModeSel) turnModeSel.value = "order";
    }

    for (let p=1;p<=playersCount;p++){
      const isCpu = (vsCPU && p===2);
      playerInputs[p].nameInput.disabled = isCpu;
      if (isCpu) playerInputs[p].emojiSel.disabled = true;
      else if (!(started && !gameOver)) playerInputs[p].emojiSel.disabled = false;
    }
  }

  // ===== Tablero =====
  function initArrays(){
    h = Array.from({length: rows}, () => Array(cols-1).fill(0));
    v = Array.from({length: rows-1}, () => Array(cols).fill(0));
    owner = Array.from({length: rows-1}, () => Array(cols-1).fill(0));
    boxEmoji = Array.from({length: rows-1}, () => Array(cols-1).fill(""));
  }

  function resize(){
    const maxW = canvas.clientWidth || (window.innerWidth - 40);
    spacing = Math.floor((maxW - 2*pad) / (cols-1));
    spacing = clamp(spacing, 18, 42);

    boardW = (cols-1)*spacing + 2*pad;
    boardH = (rows-1)*spacing + 2*pad;

    canvas.width = Math.floor(boardW * dpr);
    canvas.height = Math.floor(boardH * dpr);
    canvas.style.height = Math.round(boardH) + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function pt(r,c){ return {x: pad + c*spacing, y: pad + r*spacing}; }

  function addSparkle(x,y,color){
    for (let i=0;i<18;i++){
      const a = Math.random()*Math.PI*2;
      const sp = 0.8 + Math.random()*2.2;
      particles.push({ x,y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, life: 1.0, color, size: 1.8 + Math.random()*2.4 });
    }
  }

  function countEdgesBox(r,c){
    let cnt=0;
    if (h[r][c]) cnt++;
    if (h[r+1][c]) cnt++;
    if (v[r][c]) cnt++;
    if (v[r][c+1]) cnt++;
    return cnt;
  }

  function checkBox(r,c, who, dtFromLast){
    if (r<0||r>=rows-1||c<0||c>=cols-1) return 0;
    if (owner[r][c]) return 0;

    const top=h[r][c], bottom=h[r+1][c], left=v[r][c], right=v[r][c+1];
    if (top && bottom && left && right){
      owner[r][c]=who;
      boxEmoji[r][c]=playerEmoji[who];

      freezeUntil = Math.max(freezeUntil, performance.now()+1000);
      addSparkle(pt(r,c).x + spacing/2, pt(r,c).y + spacing/2, COLORS[who]);
      playEmojiSfx(playerEmoji[who]);

      if (dtFromLast!=null){
        if (bestCloseMs[who]==null || dtFromLast<bestCloseMs[who]) bestCloseMs[who]=dtFromLast;
        if (dtFromLast<=FAST_CLOSE_MS) fastCloseCount[who]=(fastCloseCount[who]||0)+1;
      }
      return 1;
    }
    return 0;
  }

  function isBoardFull(){
    for (let r=0;r<rows;r++) for (let c=0;c<cols-1;c++) if (!h[r][c]) return false;
    for (let r=0;r<rows-1;r++) for (let c=0;c<cols;c++) if (!v[r][c]) return false;
    return true;
  }

  function placeEdgeFor(who, edge, dtFromLast){
    if (!edge) return {made:0};
    if (edge.type==="h" && h[edge.r][edge.c]) return {made:0};
    if (edge.type==="v" && v[edge.r][edge.c]) return {made:0};

    let made=0;
    if (edge.type==="h"){
      h[edge.r][edge.c]=who;
      made += checkBox(edge.r-1, edge.c, who, dtFromLast);
      made += checkBox(edge.r, edge.c, who, dtFromLast);
    } else {
      v[edge.r][edge.c]=who;
      made += checkBox(edge.r, edge.c-1, who, dtFromLast);
      made += checkBox(edge.r, edge.c, who, dtFromLast);
    }

    if (made>0){
      score[who]+=made;
      currentChain += made;
      bestChain[who] = Math.max(bestChain[who]||0, currentChain);

      if (made>=2) doubleCloseCount[who]=(doubleCloseCount[who]||0)+1;
      if (currentChain>=3) chain3Count[who]=(chain3Count[who]||0)+1;
    } else {
      currentChain=0;
    }

    sClick();
    updateTopUI();
    draw();

    if (isBoardFull()) endGame("No quedan líneas.");
    return {made};
  }

  function resetShotClock(){
    shotLeft = shotClockStart;
    lastShotBeep=null;
    updateShotUI();
    setTurnBorder();
  }
  function recomputeShotClockFromElapsed(){
    const drops=Math.floor(gameElapsed/60);
    shotClockStart = clamp(15 - drops, shotClockMin, shotClockMax);
  }

  function placeEdgeUser(edge){
    if (!started || paused || gameOver) return;
    if (!edge) return;
    if (performance.now() < inputLockUntil) return;
    if (isCpuTurn()) return;

    clearCpuBlink();

    ensureAudio();
    const now=performance.now();
    const dt = lastMoveAt>0 ? (now-lastMoveAt) : null;
    lastMoveAt=now;

    const who=turn;
    const res=placeEdgeFor(who, edge, dt);

    inputLockUntil = now + INPUT_COOLDOWN_MS;
    resetShotClock();

    if (res.made===0){
      turn = nextTurn(turn);
      sTurn();
      resetShotClock();
      currentChain=0;
    }

    updateTopUI();
    maybeCpuPlay();
  }

  // ===== CPU AI =====
  function edgeAffectsBoxes(edge){
    const boxes=[];
    if (edge.type==="h"){ boxes.push([edge.r-1, edge.c]); boxes.push([edge.r, edge.c]); }
    else { boxes.push([edge.r, edge.c-1]); boxes.push([edge.r, edge.c]); }
    return boxes.filter(([r,c])=> r>=0 && r<rows-1 && c>=0 && c<cols-1);
  }
  function isClosingMove(edge){
    const boxes=edgeAffectsBoxes(edge);
    for (const [r,c] of boxes){
      if (owner[r][c]) continue;
      const before=countEdgesBox(r,c);
      if (before===3) return true;
    }
    return false;
  }
  function createsThirdSide(edge){
    const boxes=edgeAffectsBoxes(edge);
    for (const [r,c] of boxes){
      if (owner[r][c]) continue;
      const before=countEdgesBox(r,c);
      if (before===2) return true;
    }
    return false;
  }
  function riskScore(edge){
    const boxes=edgeAffectsBoxes(edge);
    let risk=0;
    for (const [r,c] of boxes){
      if (owner[r][c]) continue;
      const before=countEdgesBox(r,c);
      if (before===2) risk+=2;
      if (before===1) risk+=0.3;
    }
    return risk;
  }
  function listAvailableEdges(){
    const all=[];
    for (let r=0;r<rows;r++) for (let c=0;c<cols-1;c++) if (!h[r][c]) all.push({type:"h",r,c});
    for (let r=0;r<rows-1;r++) for (let c=0;c<cols;c++) if (!v[r][c]) all.push({type:"v",r,c});
    return all;
  }

  function chooseCpuMove(){
    const L = cpuLevel();
    const edges = listAvailableEdges();
    if (!edges.length) return null;

    const err = clamp((30 - L)/30, 0, 1) * 0.35;
    if (Math.random() < err) return edges[(Math.random()*edges.length)|0];

    const closers = edges.filter(isClosingMove);
    if (closers.length){
      if (!(L < 8 && Math.random() < 0.25)){
        closers.sort((a,b)=> riskScore(a)-riskScore(b));
        return closers[0];
      }
    }

    const safe = edges.filter(e => !createsThirdSide(e));
    if (safe.length){
      if (L >= 20){
        safe.sort((a,b)=> riskScore(a)-riskScore(b));
        const top = safe.slice(0, Math.max(1, Math.floor(safe.length*0.15)));
        return top[(Math.random()*top.length)|0];
      }
      return safe[(Math.random()*safe.length)|0];
    }

    edges.sort((a,b)=> riskScore(a)-riskScore(b));
    if (L >= 25) return edges[0];
    const top = edges.slice(0, Math.max(1, Math.floor(edges.length*0.25)));
    return top[(Math.random()*top.length)|0];
  }

  function maybeCpuPlay(){
    if (!isCpuTurn()) return;
    setTimeout(()=>{
      if (!isCpuTurn()) return;
      if (performance.now() < freezeUntil) { maybeCpuPlay(); return; }

      const move = chooseCpuMove();
      if (!move) return;

      const now=performance.now();
      const dt = lastMoveAt>0 ? (now-lastMoveAt) : null;
      lastMoveAt=now;

      const res = placeEdgeFor(2, move, dt);
      startCpuBlink(move);
      inputLockUntil = now + INPUT_COOLDOWN_MS;
      resetShotClock();

      if (res.made===0){
        turn=1;
    lastTurn=1;
    sinceLast={1:0,2:0,3:0,4:0};
        sTurn();
        resetShotClock();
        currentChain=0;
        updateTopUI();
      } else {
        updateTopUI();
        maybeCpuPlay();
      }
    }, clamp(260 + (50 - cpuLevel())*8, 200, 650));
  }

  // ===== Modo rápido (neutro) =====
  function shuffle(a){
    for (let i=a.length-1;i>0;i--){
      const j = (Math.random()*(i+1))|0;
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function listAllEdgesEmpty(){
    const all=[];
    for (let r=0;r<rows;r++) for (let c=0;c<cols-1;c++) if (!h[r][c]) all.push({type:"h",r,c});
    for (let r=0;r<rows-1;r++) for (let c=0;c<cols;c++) if (!v[r][c]) all.push({type:"v",r,c});
    return all;
  }
  function wouldBreakFastRule(edge){
    const boxes=edgeAffectsBoxes(edge);
    for (const [r,c] of boxes){
      const before=countEdgesBox(r,c);
      if (before===2) return true;
      if (before===3) return true;
    }
    return false;
  }
  
  function choosePenaltyEdgeAvoidClose(){
  // 1) Preferimos una que NO cierre cuadrado y NO deje "a 1 toque"
  let edges = listAvailableEdges()
    .filter(e => !isClosingMove(e) && !wouldBreakFastRule(e));

  // 2) Si no hay, al menos que NO cierre cuadrado
  if (!edges.length){
    edges = listAvailableEdges().filter(e => !isClosingMove(e));
  }

  // 3) Si aun así no hay (tablero muy avanzado), cualquiera
  if (!edges.length){
    edges = listAvailableEdges();
  }

  if (!edges.length) return null;
  return edges[(Math.random()*edges.length)|0];
}

function placePenaltyLineFor(who){
  const e = choosePenaltyEdgeAvoidClose();
  if (!e) return false;

  // Coloca la línea "para" ese jugador, pero SIN dar puntos ni cerrar (ya filtramos)
  if (e.type==="h") h[e.r][e.c] = who;
  else v[e.r][e.c] = who;

  return true;
}

  function placeNeutralEdge(edge){
    if (edge.type==="h") h[edge.r][edge.c] = -1;
    else v[edge.r][edge.c] = -1;
  }

  function quickFill(pct){
    if (!created || started) { msgEl.textContent = "Primero pulsa Crear (y no estés en partida)."; return; }

    for (let r=0;r<rows;r++) for (let c=0;c<cols-1;c++) if (h[r][c]===-1) h[r][c]=0;
    for (let r=0;r<rows-1;r++) for (let c=0;c<cols;c++) if (v[r][c]===-1) v[r][c]=0;

    const totalEdges = rows*(cols-1) + (rows-1)*cols;
    const target = Math.floor(totalEdges * pct);

    const cand = shuffle(listAllEdgesEmpty());
    let placed=0;

    for (const e of cand){
      if (placed>=target) break;
      if (wouldBreakFastRule(e)) continue;
      placeNeutralEdge(e);
      placed++;
    }

    msgEl.textContent = `Modo rápido: puestas ${placed} líneas neutrales (${Math.round(100*placed/totalEdges)}%).`;
    draw();
  }

  q25Btn.addEventListener("click", ()=>quickFill(0.25));
  q50Btn.addEventListener("click", ()=>quickFill(0.50));
  q75Btn.addEventListener("click", ()=>quickFill(0.75));

  // ===== Fin + ranking =====
  function applyRanking(winner){
    const rk=loadRank();
    for (let p=1;p<=playersCount;p++){
      if (vsCPU && p===2) continue;
      const nick=normNick(playerName[p]);
      if (!nick) continue;
      if (!rk[nick]) rk[nick]={points:0,wins:0,games:0};
      rk[nick].games += 1;
      rk[nick].points += (score[p]||0);
      if (winner===0) rk[nick].points += 3;
      else if (winner===p){ rk[nick].points += 10; rk[nick].wins += 1; }
    }
    saveRank(rk);
    updateRankTable();
  }

  function endGame(reason){
    gameOver=true;
    started=false;
    paused=false;
    stopTimer();
    sGameOver();
    stopMusic();

    let winner=0;
    let best=-1;
    let tie=false;
    for (let p=1;p<=playersCount;p++){
      const sc = score[p]||0;
      if (sc>best){ best=sc; winner=p; tie=false; }
      else if (sc===best){ tie=true; }
    }
    if (tie) winner=0;

    resultsGrid.innerHTML = "";
    for (let p=1;p<=playersCount;p++){
      const card=document.createElement("div");
      card.className="ledCard";
      if (winner!==0 && p===winner) card.classList.add("winner");
      card.innerHTML = `
        <div class="ledName">
          <span>${escapeHtml(playerName[p] || ("Jugador "+p))}</span>
          <span>${playerEmoji[p] || "🙂"}</span>
        </div>
        <div class="ledDigits">${fmt2(score[p]||0)}</div>
        <div class="hint" style="margin-top:8px;color:rgba(255,255,255,.75)">
          Tiempo restante: <span>${fmt(timeLeft[p]||0)}</span>
        </div>
      `;
      resultsGrid.appendChild(card);
    }

    winnerBadge.classList.toggle("win", winner!==0);
    winnerBadge.textContent = (winner===0) ? "EMPATE" : `GANA ${playerName[winner]} ${playerEmoji[winner]}`;

    arcadeReason.textContent = reason;
    overlay.classList.add("show");

    applyRanking(winner);
    updateTopUI();
    draw();
  }

  // ===== Timer =====
  function stopTimer(){ if (timerId) clearInterval(timerId); timerId=null; }
  function startTimer(){
    stopTimer();
    timerId=setInterval(()=>{
  if (!started || paused || gameOver) return;
  if (performance.now() < freezeUntil) return;

  // Turno que estaba activo al empezar ESTE segundo
  const activeTurn = turn;

  gameElapsed++;
  recomputeShotClockFromElapsed();

  // 1) Descontar tiempo SIEMPRE al jugador activo de este tick
  timeLeft[activeTurn] = Math.max(0, (timeLeft[activeTurn]||0) - 1);
  if (timeLeft[activeTurn]===0){
    updateTopUI();
    endGame(`Tiempo agotado de ${playerName[activeTurn]}.`);
    return;
  }

  // 2) Shot-clock del jugador activo de este tick
  shotLeft = Math.max(0, shotLeft - 1);

  if (shotLeft<=5 && shotLeft>=1){
    if (lastShotBeep!==shotLeft){ sShotBeep(); lastShotBeep=shotLeft; }
  } else lastShotBeep=null;

  // 3) Si se agota el shot-clock, penaliza AL activo y pasa turno UNA sola vez
if (shotLeft===0){
  penalties[activeTurn] = (penalties[activeTurn]||0) + 1;
  sPenalty();

  // pasa turno
  turn = nextTurn(activeTurn);

  // CASTIGO: pone 1 línea aleatoria "a favor" del siguiente jugador (turn),
  // evitando cerrar cuadrado (y preferiblemente sin dejar a 1 toque)
  placePenaltyLineFor(turn);

  // sonido de cambio de turno (y visual)
  sTurn();

  resetShotClock();
  currentChain = 0;
  pendingEdge = null;
  
  draw();
}

  updateTopUI();
  setTurnBorder();

  // si el nuevo turno es CPU, que juegue
  maybeCpuPlay();
}, 1000);

  }

  // ===== Crear/Iniciar =====
  function resetStats(){
    score={1:0,2:0,3:0,4:0};
    penalties={1:0,2:0,3:0,4:0};
    bestChain={1:0,2:0,3:0,4:0};
    currentChain=0;
    bestCloseMs={1:null,2:null,3:null,4:null};
    chain3Count={1:0,2:0,3:0,4:0};
    doubleCloseCount={1:0,2:0,3:0,4:0};
    fastCloseCount={1:0,2:0,3:0,4:0};
    lastMoveAt=0;
    particles=[];
  }

  function createBoard(){
    if (!namesOk()) return;

    rows = clamp(parseInt(rowsEl.value,10)||20, 6, 30);
    cols = clamp(parseInt(colsEl.value,10)||20, 6, 30);
    rowsEl.value=rows; colsEl.value=cols;
    syncBoardBtnLabel();

    const minutes = clamp(parseInt(clockEl.value,10)||5, 1, 60);
    clockStart = minutes*60;
    timeLeft={1:clockStart,2:clockStart,3:clockStart,4:clockStart};

    started=false; paused=false; gameOver=false; created=true;
    document.body.classList.remove("playing");
    document.body.classList.remove("showSettings");
    freezeUntil=0; inputLockUntil=0;
    pendingEdge=null; hover=null;

    gameElapsed=0;
    shotClockStart=15;
    shotLeft=shotClockStart;

    resetStats();
    turn=1;

    vsCPU = (modeSel.value==="cpu");
    if (vsCPU){
      playersCount = 2;
      playersSel.value = "2";
      // NO buildPlayersUI() aquí
      if (playerInputs[2]) {
        playerInputs[2].nameInput.value = "CPU";
        playerInputs[2].emojiSel.value = "🤖";
      }
    }


    syncPlayerDataFromUI();
    initArrays();
    resize();

    overlay.classList.remove("show");
    msgEl.innerHTML='Tablero creado. (Opcional: usa <b>Rápido</b>). Pulsa <b>Iniciar</b>.';
    updateTopUI();
    draw();
  }

  function startGame(){
    if (!created || !namesOk()) return;

    // gesto del usuario -> aquí arrancamos audio y música sí o sí
    ensureAudio();

    started=true; paused=false; gameOver=false;
    document.body.classList.remove("showSettings");
    msgEl.textContent="";
    resetShotClock();
    updateTopUI();
    draw();
    startTimer();
    maybeCpuPlay();
    startRandomMusic();
  }

  // ===== Dibujo =====
  function stepParticles(){
    if (!particles.length) return;
    for (const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= 0.035;
    }
    particles = particles.filter(p=>p.life>0);
  }

  function draw(){
    ctx.clearRect(0,0,boardW,boardH);
    const nowMs = performance.now();

    ctx.fillStyle = isArcade() ? "rgba(10,12,20,.85)" : "#ffffff";
    ctx.fillRect(0,0,boardW,boardH);

    for (let r=0;r<rows-1;r++){
      for (let c=0;c<cols-1;c++){
        const o=owner[r][c]; if (!o) continue;
        const p=pt(r,c);
        ctx.fillStyle = alpha(COLORS[o], 0.18);
        ctx.fillRect(p.x,p.y,spacing,spacing);

        const e=boxEmoji[r][c];
        if (e){
          ctx.font = `${Math.floor(spacing*0.62)}px system-ui, Apple Color Emoji, Segoe UI Emoji`;
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillStyle = isArcade() ? "#e5e7eb" : "#111827";
          ctx.fillText(e, p.x+spacing/2, p.y+spacing/2+1);
        }
      }
    }

    ctx.lineCap="round"; ctx.lineJoin="round";
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols-1;c++){
        const who=h[r][c]; if (!who) continue;
        const a=pt(r,c), b=pt(r,c+1);
        const blink = cpuLastEdge && (nowMs < cpuBlinkUntil) && (who===CPU_PLAYER) && (cpuLastEdge.type==="h") && (cpuLastEdge.r===r) && (cpuLastEdge.c===c);
        if (blink){
          const phase = (Math.floor(nowMs/180) % 2);
          ctx.strokeStyle = phase ? COLORS[who] : (isArcade() ? "#ffffff" : "#111827");
          ctx.lineWidth = phase ? 7 : 10;
        } else {
          ctx.strokeStyle = who===-1 ? neutralLineColor() : COLORS[who];
          ctx.lineWidth = who===-1 ? 5 : 6;
        }
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
    for (let r=0;r<rows-1;r++){
      for (let c=0;c<cols;c++){
        const who=v[r][c]; if (!who) continue;
        const a=pt(r,c), b=pt(r+1,c);
        const blink = cpuLastEdge && (nowMs < cpuBlinkUntil) && (who===CPU_PLAYER) && (cpuLastEdge.type==="v") && (cpuLastEdge.r===r) && (cpuLastEdge.c===c);
        if (blink){
          const phase = (Math.floor(nowMs/180) % 2);
          ctx.strokeStyle = phase ? COLORS[who] : (isArcade() ? "#ffffff" : "#111827");
          ctx.lineWidth = phase ? 7 : 10;
        } else {
          ctx.strokeStyle = who===-1 ? neutralLineColor() : COLORS[who];
          ctx.lineWidth = who===-1 ? 5 : 6;
        }
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }

    if (started && !gameOver && !paused && hover && !isCpuTurn()){
      ctx.strokeStyle = alpha(COLORS[turn], 0.28);
      ctx.lineWidth=8;
      ctx.setLineDash([8,7]);
      if (hover.type==="h"){
        const a=pt(hover.r,hover.c), b=pt(hover.r,hover.c+1);
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      } else {
        const a=pt(hover.r,hover.c), b=pt(hover.r+1,hover.c);
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    if (particles.length){
      for (const p of particles){
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      stepParticles();
      requestAnimationFrame(draw);
    }

    ctx.fillStyle = dotColor();
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        const p=pt(r,c);
        ctx.beginPath();
        ctx.arc(p.x,p.y,3.2,0,Math.PI*2);
        ctx.fill();
      }
    }
  }

  // ===== Pick edge =====
  function distToSegment(px,py, x1,y1, x2,y2){
    const vx=x2-x1, vy=y2-y1;
    const wx=px-x1, wy=py-y1;
    const c1=wx*vx + wy*vy;
    if (c1<=0) return Math.hypot(px-x1, py-y1);
    const c2=vx*vx + vy*vy;
    if (c2<=c1) return Math.hypot(px-x2, py-y2);
    const t=c1/c2;
    const bx=x1+t*vx, by=y1+t*vy;
    return Math.hypot(px-bx, py-by);
  }
  function pickEdge(x,y){
    const thresh=Math.max(12, spacing*0.33);
    const gx=(x-pad)/spacing;
    const gy=(y-pad)/spacing;
    const nearCol=Math.round(gx);
    const nearRow=Math.round(gy);
    const cand=[];

    for (let r of [nearRow-1,nearRow,nearRow+1]){
      if (r<0||r>=rows) continue;
      const c0=Math.floor(gx);
      for (let c of [c0-1,c0,c0+1]){
        if (c<0||c>=cols-1) continue;
        if (h[r][c]) continue;
        const a=pt(r,c), b=pt(r,c+1);
        cand.push({type:"h",r,c,d:distToSegment(x,y,a.x,a.y,b.x,b.y)});
      }
    }
    for (let c of [nearCol-1,nearCol,nearCol+1]){
      if (c<0||c>=cols) continue;
      const r0=Math.floor(gy);
      for (let r of [r0-1,r0,r0+1]){
        if (r<0||r>=rows-1) continue;
        if (v[r][c]) continue;
        const a=pt(r,c), b=pt(r+1,c);
        cand.push({type:"v",r,c,d:distToSegment(x,y,a.x,a.y,b.x,b.y)});
      }
    }
    if (!cand.length) return null;
    cand.sort((a,b)=>a.d-b.d);
    const best=cand[0];
    if (best.d>thresh) return null;
    return {type:best.type,r:best.r,c:best.c};
  }

  function getPos(evt){
    const rect=canvas.getBoundingClientRect();
    const t=evt.touches ? evt.touches[0] : null;
    const clientX=t ? t.clientX : evt.clientX;
    const clientY=t ? t.clientY : evt.clientY;
    const sx=(clientX-rect.left);
    const sy=(clientY-rect.top);
    const scaleX=boardW/rect.width;
    const scaleY=boardH/rect.height;
    return {x:sx*scaleX, y:sy*scaleY};
  }

  function confirmEdge(edge){
    if (!edge) return;
    const now=performance.now();
    if (now < inputLockUntil) return;
    if (safeTapEl.checked){
      if (pendingEdge &&
          pendingEdge.type===edge.type && pendingEdge.r===edge.r && pendingEdge.c===edge.c &&
          (now - pendingEdge.t) <= PENDING_MS){
        pendingEdge=null;
        placeEdgeUser(edge);
        return;
      }
      pendingEdge={...edge,t:now};
      msgEl.innerHTML='Toque seguro: toca <b>otra vez</b> la misma línea.';
      draw();
      return;
    }
    placeEdgeUser(edge);
  }

  function onMove(evt){
    if (!started || gameOver || paused || isCpuTurn()) { hover=null; draw(); return; }
    const {x,y}=getPos(evt);
    hover=pickEdge(x,y);
    draw();
  }
  function onDown(evt){
    evt.preventDefault();
    ensureAudio();
    if (!started || gameOver || paused) return;
    if (isCpuTurn()) return;
    const {x,y}=getPos(evt);
    confirmEdge(pickEdge(x,y));
  }

  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("touchstart", onDown, {passive:false});
  canvas.addEventListener("touchmove", (e)=>{ e.preventDefault(); onMove(e); }, {passive:false});

  // ===== UI =====
createBtn.addEventListener("click", createBoard); // lo dejas como “avanzado” si quieres
startBtn.addEventListener("click", ()=>{
  // Empezar = Crear + Iniciar
  if (!created) createBoard();
  if (created && !started && !gameOver) startGame();
});


  pauseBtn.addEventListener("click", ()=>{
    if (!started || gameOver) return;
    paused=!paused;
    updateTopUI();
    draw();
    if (!paused) maybeCpuPlay();
  });

  // Botones in-game (HUD)
  pauseBtn2.addEventListener("click", ()=> pauseBtn.click());
  settingsBtn2.addEventListener("click", ()=>{
    document.body.classList.toggle("showSettings");
    updateTopUI();
    draw();
    // sube al panel de ajustes si se muestra
    if (document.body.classList.contains("showSettings")){
      window.scrollTo({top:0, behavior:"smooth"});
    }
  });

  playAgainBtn.addEventListener("click", ()=>{
    overlay.classList.remove("show");
    createBoard();
    startGame();
  });
  closeOverlayBtn.addEventListener("click", ()=>overlay.classList.remove("show"));

  themeSel.addEventListener("change", ()=>{
    document.body.classList.remove("theme-light","theme-arcade","theme-paper");
    document.body.classList.add(`theme-${themeSel.value}`);
    updateTopUI();
    draw();
  });


// Tablero: botón + modal
function syncBoardBtnLabel(){
  if (!boardBtn) return;
  boardBtn.textContent = `${colsEl.value}×${rowsEl.value}`;
}

if (boardBtn){
  boardBtn.addEventListener("click", ()=>{
    if (!boardOverlay) return;
    boardColsEl.value = colsEl.value;
    boardRowsEl.value = rowsEl.value;
    boardOverlay.classList.add("show");
  });
}
if (boardCancelBtn){
  boardCancelBtn.addEventListener("click", ()=> boardOverlay.classList.remove("show"));
}
if (boardApplyBtn){
  boardApplyBtn.addEventListener("click", ()=>{
    const nc = clamp(parseInt(boardColsEl.value,10)||20, 6, 30);
    const nr = clamp(parseInt(boardRowsEl.value,10)||20, 6, 30);
    colsEl.value = nc;
    rowsEl.value = nr;
    syncBoardBtnLabel();
    boardOverlay.classList.remove("show");

    // Si hay partida en curso, reiniciar tablero (manteniendo nombres/emojis)
    if (started && !gameOver){
      if (!confirm("Cambiar el tablero reinicia la partida. ¿Continuar?")) return;
      // fuerza recreación
      created = false;
      started = false;
      paused = false;
      gameOver = false;
      stopTimer();
    }
    // Si ya estaba creado o estamos listos, recrear para aplicar
    if (!started){
      createBoard();
    } else {
      updateTopUI();
      draw();
    }
  });
}

// Turnos (4 jugadores): si se cambia a aleatorio, reinicia contadores
if (turnModeSel){
  turnModeSel.addEventListener("change", ()=>{
    sinceLast = {1:0,2:0,3:0,4:0};
    lastTurn = turn;
    updateTopUI();
  });
}

  modeSel.addEventListener("change", ()=>{
    if (modeSel.value==="cpu"){
      playersCount = 2;
      playersSel.value = "2";
      buildPlayersUI();
    }
    vsCPU = (modeSel.value==="cpu");
    cpuLvlCard.style.display = vsCPU ? "" : "none";
    if (vsCPU){
      playerInputs[2].nameInput.value="CPU";
      playerInputs[2].emojiSel.value="🤖";
    }
    updateTopUI();
  });

  playersSel.addEventListener("change", ()=>{
    const val = parseInt(playersSel.value,10) || 2;
    playersCount = (val===4) ? 4 : (val===3 ? 3 : 2);
    if (playersCount>2){
      modeSel.value = "pvp";
      vsCPU = false;
      cpuLvlCard.style.display = "none";
    }
    buildPlayersUI();
    created=false; started=false; paused=false; gameOver=false;
    updateTopUI();
    draw();
  });

  cpuLevelEl.addEventListener("change", ()=>{ updateTopUI(); });

  safeTapEl.addEventListener("change", ()=>{ pendingEdge=null; updateTopUI(); draw(); });
  loupeOnEl.addEventListener("change", ()=>updateTopUI());
  soundOnEl.addEventListener("change", ()=>{
    if (soundOnEl.checked){
      ensureAudio();
      // si estamos en partida y no hay música, arranca
      if (started && !gameOver) startRandomMusic();
    } else {
      stopMusic();
    }
    updateTopUI();
  });

  window.addEventListener("resize", ()=>{ if (created){ resize(); draw(); } });

  // ===== Boot =====
  function boot(){
    // defaults requeridos
    safeTapEl.checked = false;
    loupeOnEl.checked = false;

    playersCount = parseInt(playersSel.value,10) || 2;
    buildPlayersUI();
    cpuLvlCard.style.display="none";
    created=false; started=false; paused=false; gameOver=false;

    rows=clamp(parseInt(rowsEl.value,10)||20, 6, 30);
    cols=clamp(parseInt(colsEl.value,10)||20, 6, 30);

    const minutes=clamp(parseInt(clockEl.value,10)||5, 1, 60);
    clockStart=minutes*60;
    timeLeft={1:clockStart,2:clockStart,3:clockStart,4:clockStart};

    initArrays();
    resize();
    draw();
    syncBoardBtnLabel();
    updateTopUI();
    renderPlayHud();
    updateRankTable();
  }

  boot();
})();
