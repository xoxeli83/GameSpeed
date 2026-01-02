(() => {
  const $ = (s)=>document.querySelector(s);
  const $$ = (s)=>Array.from(document.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

  // UI
  const fxCanvas = $("#fxCanvas");
  const fx = fxCanvas.getContext("2d");
  const toastEl = $("#toast");

  const scoreText = $("#scoreText");
  const timerText = $("#timerText");
  const seriesText = $("#seriesText");
  const turnTitle = $("#turnTitle");
  const turnSub = $("#turnSub");
  const turnLock = $("#turnLock");

  const btnStart = $("#btnStart");
  const btnFinish = $("#btnFinish");
  const btnUndo = $("#btnUndo");
  const btnNew = $("#btnNew");
  const btnSettings = $("#btnSettings");

  const settingsBackdrop = $("#settingsBackdrop");
  const settingsModal = $("#settingsModal");
  const btnCloseSettings = $("#btnCloseSettings");
  const btnApplySettings = $("#btnApplySettings");
  const btnClearSave = $("#btnClearSave");
  const statsLine = $("#statsLine");

  const modeSelect = $("#modeSelect");
  const playersSelect = $("#playersSelect");
  const cpuSelect = $("#cpuSelect");
  const cpuPersonaEl = $("#cpuPersona");
  const learnSelect = $("#learnSelect");
  const startSelect = $("#startSelect");
  const seriesSelect = $("#seriesSelect");
  const blitzSelect = $("#blitzSelect");
  const obstaclesSelect = $("#obstaclesSelect");
  const undoLimitEl = $("#undoLimit");
  const maxRemoveEl = $("#maxRemove");
  const rowA = $("#rowA");
  const rowB = $("#rowB");
  const rowC = $("#rowC");
  const focusSelect = $("#focusSelect");
  const profSelect = $("#profSelect");
  const challengeSelect = $("#challengeSelect");
  const saveSelect = $("#saveSelect");
  const skinSelect = $("#skinSelect");
  const contrastSelect = $("#contrastSelect");

  const overlay = $("#overlay");
  const ovBig = $("#ovBig");
  const ovTitle = $("#ovTitle");
  const ovSub = $("#ovSub");
  const btnNext = $("#btnNext");
  const btnCloseOverlay = $("#btnCloseOverlay");

  const resumeOverlay = $("#resumeOverlay");
  const btnResume = $("#btnResume");
  const btnDiscard = $("#btnDiscard");
  const btnCloseResume = $("#btnCloseResume");

  // FX canvas
  let particles=[];
  let fxRunning=false;
  function resizeFX(){
    const dpr=Math.max(1,window.devicePixelRatio||1);
    fxCanvas.width=Math.floor(window.innerWidth*dpr);
    fxCanvas.height=Math.floor(window.innerHeight*dpr);
    fxCanvas.style.width=window.innerWidth+"px";
    fxCanvas.style.height=window.innerHeight+"px";
    fx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener("resize", resizeFX);
  resizeFX();
  function burst(x,y,count=240,power=7){
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2;
      const s=(Math.random()**0.35)*power;
      particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.2,g:0.085+Math.random()*0.05,r:2+Math.random()*3.8,life:78+Math.random()*52,hue:Math.floor(Math.random()*360),spin:(Math.random()-0.5)*0.25});
    }
    if(!fxRunning){ fxRunning=true; requestAnimationFrame(tickFX); }
  }
  function tickFX(){
    fx.clearRect(0,0,window.innerWidth,window.innerHeight);
    particles=particles.filter(p=>p.life>0);
    for(const p of particles){
      p.life-=1; p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.vx*=0.992; p.vy*=0.992;
      const alpha=Math.max(0,Math.min(1,p.life/80));
      fx.save(); fx.translate(p.x,p.y); fx.rotate(p.spin*(90-p.life)); fx.globalAlpha=alpha;
      fx.fillStyle=`hsl(${p.hue} 95% 62%)`; fx.fillRect(-p.r,-p.r*1.4,p.r*2,p.r*2.8); fx.restore();
    }
    if(particles.length) requestAnimationFrame(tickFX);
    else fxRunning=false;
  }

  // Simple sounds
  let audioCtx=null;
  function ensureAudio(){ if(audioCtx) return; audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }
  function beep(freq=440,dur=0.06,type="sine",gain=0.08){
    try{
      ensureAudio();
      const t0=audioCtx.currentTime;
      const o=audioCtx.createOscillator();
      const g=audioCtx.createGain();
      o.type=type; o.frequency.setValueAtTime(freq,t0);
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.exponentialRampToValueAtTime(gain,t0+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t0); o.stop(t0+dur+0.02);
    }catch{}
  }
  function vib(ms=18){ if(navigator.vibrate) navigator.vibrate(ms); }

  function toast(msg){
    toastEl.textContent=msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t=setTimeout(()=>toastEl.classList.remove("show"), 1300);
  }

  // Storage keys
  const SAVE_KEY = "palillos_ultra_save_v10";
  const STATS_KEY = "palillos_ultra_stats_v10";

  // Persistent stats
  let permStats = { games:0, wins_p1:0, wins_p2:0, cpu_wins:0, moves_total:0, removed_total:0, timeouts:0 };
  function loadStats(){
    try{
      const raw=localStorage.getItem(STATS_KEY);
      if(raw) permStats = {...permStats, ...JSON.parse(raw)};
    }catch{}
  }
  function saveStats(){
    try{ localStorage.setItem(STATS_KEY, JSON.stringify(permStats)); }catch{}
  }
  function refreshStatsLine(){
    const avg = permStats.moves_total>0 ? (permStats.removed_total/permStats.moves_total) : 0;
    statsLine.textContent = `Stats: partidas ${permStats.games} | removidos/turno ${avg.toFixed(2)} | timeouts ${permStats.timeouts}`;
  }

  // Game config
  let mode="cpu"; // local|cpu
  let players=2;
  let cpuLevel="random";
  let cpuPersona="balanced";
  let learning=true;
  let startMode="rand";
  let seriesLen=1;
  let blitzSeconds=10;
  let obstaclesPerRow=0;
  let undoLimit=1;
  let maxRemove=0;
  let ROWS=[7,5,3];
  let focus=false;
  let professor=false;
  let challenge="none";
  let autoSave=true;

  // Series
  let roundWins={p1:0,p2:0};
  let roundNeed=2;

  // State
  let gameStarted=false;
  let currentPlayer=1;
  let state=[];     // true present
  let blocked=[];   // true blocked
  let activeRow=null;
  let selected=[];
  let history=[];
  let dragging=false;
  let undoUsedThisRound=0;

  // Timer
  let timerId=null;
  let timerEndAt=0;

  function applySkin(){
    document.body.classList.remove("skin-neon","skin-wood","skin-minimal","contrast","focus");
    const s=skinSelect.value;
    if(s==="neon") document.body.classList.add("skin-neon");
    if(s==="wood") document.body.classList.add("skin-wood");
    if(s==="minimal") document.body.classList.add("skin-minimal");
    if(contrastSelect.value==="1") document.body.classList.add("contrast");
    if(focus) document.body.classList.add("focus");
  }

  function updateRoundNeed(){
    if(mode==="local" && players>2){
      seriesLen=1;
      seriesSelect.value="1";
    }
    roundNeed = (seriesLen===1) ? 1 : (seriesLen===3 ? 2 : 3);
    seriesText.textContent = (seriesLen===1) ? "Única" : `Bo${seriesLen} (a ${roundNeed})`;
  }

  function playerName(p){
    if(mode==="cpu") return (p===1) ? "Jugador 1" : "CPU";
    return `Jugador ${p}`;
  }

  function nextPlayer(p){
    const n = (mode==="local") ? players : 2;
    return (p % n) + 1;
  }

  function stopTimer(){
    if(timerId) clearInterval(timerId);
    timerId=null;
    timerText.textContent="—";
  }
  function startTimer(){
    stopTimer();
    if(!gameStarted) return;
    if(blitzSeconds<=0) return;
    timerEndAt = Date.now() + blitzSeconds*1000;
    tickTimer();
    timerId = setInterval(tickTimer, 125);
  }
  function tickTimer(){
    const ms = timerEndAt - Date.now();
    if(ms<=0){
      timerText.textContent="0.0s";
      stopTimer();
      applyTimePenalty();
      return;
    }
    timerText.textContent = (ms/1000).toFixed(1)+"s";
  }

  function anyRemovableLeft(){
    for(let r=0;r<ROWS.length;r++){
      for(let i=0;i<ROWS[r];i++){
        if(state[r][i] && !blocked[r][i]) return true;
      }
    }
    return false;
  }
  function gameOver(){ return !anyRemovableLeft(); }

  function clearSelection(){
    activeRow=null; selected=[];
    $$(".row").forEach(el=>{ el.classList.remove("active","hasSel"); });
    btnFinish.disabled=true;
    render();
  }

  function contiguousOk(newIdx){
    if(selected.length===0) return true;
    const min=Math.min(...selected), max=Math.max(...selected);
    return (newIdx===min-1 || newIdx===max+1);
  }

  function addSel(idx){
    if(selected.includes(idx)) return;
    if(!contiguousOk(idx)){ toast("Solo contiguos (sin saltos)."); vib(22); beep(160,0.10,"square",0.05); return; }
    if(maxRemove>0 && selected.length+1>maxRemove){
      toast(`Máximo ${maxRemove} por turno.`);
      vib(18);
      beep(160,0.10,"square",0.05);
      return;
    }
    selected.push(idx);
    beep(520,0.03,"triangle",0.05);
    vib(6);
    btnFinish.disabled = selected.length===0;
    render();
  }

  function toggleSel(idx){
    if(selected.includes(idx)){
      const min=Math.min(...selected), max=Math.max(...selected);
      if(idx!==min && idx!==max){ toast("Solo puedes desmarcar extremos."); vib(22); beep(150,0.08,"square",0.05); return; }
      selected = selected.filter(x=>x!==idx);
      if(selected.length===0) activeRow=null;
      btnFinish.disabled = selected.length===0;
      render();
      return;
    }
    addSel(idx);
  }

  function snapshot(){
    return {
      cfg: { mode, players, cpuLevel, cpuPersona, learning, startMode, seriesLen, blitzSeconds, obstaclesPerRow, undoLimit, maxRemove, ROWS, focus, professor, challenge, autoSave,
             skin: skinSelect.value, contrast: contrastSelect.value },
      run: { gameStarted, currentPlayer, state, blocked, activeRow, selected, roundWins, undoUsedThisRound,
             history: [] } // no guardamos history en autoSave
    };
  }
  function exportSave(){
    return {
      cfg: { mode, players, cpuLevel, cpuPersona, learning, startMode, seriesLen, blitzSeconds, obstaclesPerRow, undoLimit, maxRemove, ROWS, focus, professor, challenge, autoSave,
             skin: skinSelect.value, contrast: contrastSelect.value },
      run: { gameStarted, currentPlayer, state, blocked, roundWins, undoUsedThisRound }
    };
  }
  function importSave(obj){
    // cfg
    const c=obj.cfg||{};
    mode = c.mode ?? mode;
    players = c.players ?? players;
    cpuLevel = c.cpuLevel ?? cpuLevel;
    cpuPersona = c.cpuPersona ?? cpuPersona;
    learning = c.learning ?? learning;
    startMode = c.startMode ?? startMode;
    seriesLen = c.seriesLen ?? seriesLen;
    blitzSeconds = c.blitzSeconds ?? blitzSeconds;
    obstaclesPerRow = c.obstaclesPerRow ?? obstaclesPerRow;
    undoLimit = c.undoLimit ?? undoLimit;
    maxRemove = c.maxRemove ?? maxRemove;
    ROWS = c.ROWS ?? ROWS;
    focus = c.focus ?? focus;
    professor = c.professor ?? professor;
    challenge = c.challenge ?? challenge;
    autoSave = c.autoSave ?? autoSave;

    skinSelect.value = c.skin ?? "ultra";
    contrastSelect.value = c.contrast ?? "0";

    // sync UI
    modeSelect.value = mode;
    playersSelect.value = String(players);
    cpuSelect.value = cpuLevel;
    cpuPersonaEl.value = cpuPersona;
    learnSelect.value = learning ? "1" : "0";
    startSelect.value = startMode;
    seriesSelect.value = String(seriesLen);
    blitzSelect.value = String(blitzSeconds);
    obstaclesSelect.value = String(obstaclesPerRow);
    undoLimitEl.value = String(undoLimit);
    maxRemoveEl.value = String(maxRemove);
    rowA.value = String(ROWS[0]); rowB.value = String(ROWS[1]); rowC.value = String(ROWS[2]);
    focusSelect.value = focus ? "1" : "0";
    profSelect.value = professor ? "1" : "0";
    challengeSelect.value = challenge;
    saveSelect.value = autoSave ? "1" : "0";

    applyProfessorRules(false);
    applyChallenge(false);
    updateRoundNeed();
    applySkin();

    // run
    const r=obj.run||{};
    gameStarted = !!r.gameStarted;
    currentPlayer = r.currentPlayer ?? currentPlayer;
    state = r.state ?? state;
    blocked = r.blocked ?? blocked;
    roundWins = r.roundWins ?? roundWins;
    undoUsedThisRound = r.undoUsedThisRound ?? 0;

    // clean selection + history
    activeRow=null; selected=[]; history=[]; dragging=false;

    rebuildDOMFromState();
    updateHeader();
    render();
    if(gameStarted){
      btnStart.disabled = true;
      btnNew.disabled = false;
      startTimer();
      if(mode==="cpu" && currentPlayer===2) cpuMoveSoon();
    }else{
      btnStart.disabled = false;
      btnNew.disabled = true;
      stopTimer();
    }
  }

  function persistSave(){
    if(!autoSave) return;
    try{ localStorage.setItem(SAVE_KEY, JSON.stringify(exportSave())); }catch{}
  }
  function clearSavedGame(){
    try{ localStorage.removeItem(SAVE_KEY); }catch{}
  }

  function updateHeader(){
    updateRoundNeed();
    scoreText.textContent = `${roundWins.p1} - ${roundWins.p2}`;

    if(!gameStarted){
      turnTitle.textContent = "Pulsa Iniciar";
      turnSub.textContent = "Ajusta opciones con “Ajustes”.";
      turnLock.textContent = "🔒";
      return;
    }

    const isCpuTurn = (mode==="cpu" && currentPlayer===2);
    const locked = overlay.classList.contains("show") || resumeOverlay.classList.contains("show") || (isCpuTurn);
    turnLock.textContent = locked ? "⛔" : "✅";

    turnTitle.textContent = `Turno: ${playerName(currentPlayer)}`;
    if(isCpuTurn){
      turnSub.textContent = "La CPU está pensando…";
    }else{
      turnSub.textContent = "Arrastra/toca contiguos. Finaliza turno cuando quieras.";
    }
  }

  function pickStartPlayer(){
    const n=(mode==="local")?players:2;
    if(startMode==="rand") return (Math.floor(Math.random()*n)+1);
    const v=parseInt(startMode,10);
    if(!isFinite(v) || v<1 || v>n) return 1;
    return v;
  }

  function buildNewRoundState(){
    // state arrays
    state = ROWS.map(n=>Array(n).fill(true));
    blocked = ROWS.map(n=>Array(n).fill(false));
    activeRow=null; selected=[]; history=[];
    dragging=false;
    undoUsedThisRound=0;
    btnUndo.disabled = true;
    btnFinish.disabled = true;

    // obstacles
    const k = obstaclesPerRow;
    if(k>0){
      for(let r=0;r<ROWS.length;r++){
        const n=ROWS[r];
        const toBlock = Math.min(k, Math.max(0,n-1));
        const idxs=[];
        while(idxs.length<toBlock){
          const x=Math.floor(Math.random()*n);
          if(!idxs.includes(x)) idxs.push(x);
        }
        idxs.forEach(i=>blocked[r][i]=true);
      }
    }
  }

  function rebuildDOMFromState(){
    // DOM rows
    for(let r=0;r<3;r++){
      const rowEl = $("#row"+r);
      // keep selectGlow as first child
      rowEl.innerHTML = '<div class="selectGlow"></div>';
      for(let i=0;i<ROWS[r];i++){
        const st=document.createElement("div");
        st.className="stick"+((i%2)?" alt":"");
        st.dataset.row=r; st.dataset.index=i;

        st.addEventListener("pointerdown",(e)=>{
          ensureAudio();
          e.preventDefault();
          if(!gameStarted){ toast("Pulsa Iniciar"); return; }
          if(overlay.classList.contains("show") || resumeOverlay.classList.contains("show")) return;
          if(mode==="cpu" && currentPlayer===2) return;

          const rr=+st.dataset.row, ii=+st.dataset.index;
          if(!state[rr][ii] || blocked[rr][ii]) return;

          if(activeRow!==null && activeRow!==rr){ clearSelection(); }
          if(activeRow===null){
            activeRow=rr;
            $$(".row").forEach(el=>el.classList.toggle("active", +el.dataset.row===activeRow));
          }
          dragging=true;
          toggleSel(ii);
          try{ st.setPointerCapture(e.pointerId); }catch{}
        }, {passive:false});

        st.addEventListener("pointerenter", ()=>{
          if(!dragging) return;
          if(!gameStarted) return;
          if(overlay.classList.contains("show") || resumeOverlay.classList.contains("show")) return;
          if(mode==="cpu" && currentPlayer===2) return;

          const rr=+st.dataset.row, ii=+st.dataset.index;
          if(activeRow===null || rr!==activeRow) return;
          if(!state[rr][ii] || blocked[rr][ii]) return;
          addSel(ii);
        });

        st.addEventListener("pointerup", ()=>{ dragging=false; });
        st.addEventListener("pointercancel", ()=>{ dragging=false; });

        rowEl.appendChild(st);
      }
    }
  }

  // Global pointerup so drag no se queda pegado
  window.addEventListener("pointerup", ()=>{ dragging=false; });
  window.addEventListener("pointercancel", ()=>{ dragging=false; });

  function startNewRound(){
    clearSelection();
    stopTimer();
    currentPlayer = pickStartPlayer();
    buildNewRoundState();
    rebuildDOMFromState();
    updateHeader();
    render();
    persistSave();

    if(gameStarted){
      startTimer();
      if(mode==="cpu" && currentPlayer===2) cpuMoveSoon();
    }
  }

  function render(){
    // rows dim
    const isCpuTurn = (mode==="cpu" && currentPlayer===2);
    $$(".row").forEach(el=>{
      const r=+el.dataset.row;
      const dim = gameStarted && isCpuTurn;
      el.classList.toggle("dim", dim);
      el.classList.toggle("active", activeRow!==null && r===activeRow);
      el.classList.toggle("hasSel", activeRow!==null && r===activeRow && selected.length>0);
    });

    // sticks
    $$(".stick").forEach(st=>{
      const r=+st.dataset.row, i=+st.dataset.index;
      st.classList.toggle("removed", !state[r][i]);
      st.classList.toggle("blocked", blocked[r][i] && state[r][i]);
      st.classList.toggle("selected", (r===activeRow && selected.includes(i)));
    });

    // buttons
    const locked = !gameStarted || overlay.classList.contains("show") || resumeOverlay.classList.contains("show") || isCpuTurn;
    btnFinish.disabled = locked || selected.length===0 || activeRow===null;
    btnUndo.disabled = locked || history.length===0 || (undoUsedThisRound>=undoLimit);
    btnNew.disabled = !gameStarted;

    updateHeader();
  }

  function finishMove(row, idxs, fromPenalty=false){
    if(idxs.length===0) return;

    // save undo snapshot only if allowed (we keep one history stack anyway)
    history.push({
      state: state.map(r=>r.slice()),
      blocked: blocked.map(r=>r.slice()),
      currentPlayer,
      roundWins: {...roundWins},
      undoUsedThisRound
    });

    // apply move
    idxs.forEach(i=>state[row][i]=false);

    // stats
    permStats.moves_total += 1;
    permStats.removed_total += idxs.length;
    if(fromPenalty) permStats.timeouts += 1;
    saveStats();
    refreshStatsLine();

    // reset selection
    selected=[]; activeRow=null; dragging=false;
    render();
    persistSave();

    // lose if removed last
    if(gameOver()){
      stopTimer();
      const loser=currentPlayer;
      const winner=nextPlayer(loser);
      onRoundEnd(winner, loser);
      persistSave();
      return;
    }

    // next turn
    currentPlayer = nextPlayer(currentPlayer);
    render();
    startTimer();
    persistSave();

    if(mode==="cpu" && currentPlayer===2) cpuMoveSoon();
  }

  function applyTimePenalty(){
    if(!gameStarted) return;
    if(overlay.classList.contains("show") || resumeOverlay.classList.contains("show")) return;

    const candidates=[];
    for(let r=0;r<ROWS.length;r++){
      for(let i=0;i<ROWS[r];i++){
        if(state[r][i] && !blocked[r][i]) candidates.push([r,i]);
      }
    }
    if(candidates.length===0){
      const loser=currentPlayer;
      const winner=nextPlayer(loser);
      onRoundEnd(winner, loser);
      return;
    }
    const [r,i]=candidates[Math.floor(Math.random()*candidates.length)];
    toast("⏱️ Tiempo agotado: penalización (1 palillo).");
    vib(35); beep(160,0.10,"square",0.05);
    finishMove(r,[i], true);
  }

  // End overlay
  function showOverlay(big,title,sub){
    ovBig.textContent=big;
    ovTitle.textContent=title;
    ovSub.textContent=sub;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden","false");
    render();
  }
  function hideOverlay(){
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden","true");
    render();
  }

  function onRoundEnd(winner, loser){
    stopTimer();

    // big FX
    burst(window.innerWidth/2, window.innerHeight*0.38, 520, 9.0);
    beep(523.25,0.10,"triangle",0.10); setTimeout(()=>beep(659.25,0.12,"triangle",0.10),70); setTimeout(()=>beep(783.99,0.16,"triangle",0.10),140);

    // 3-4 players: one round only
    if(mode==="local" && players>2){
      permStats.games += 1;
      if(winner===1) permStats.wins_p1 += 1; else permStats.wins_p2 += 1;
      saveStats();
      refreshStatsLine();
      showOverlay("¡FIN!", `Gana ${playerName(winner)}`, `${playerName(loser)} quitó el último (pierde).`);
      return;
    }

    // 2-player series score
    if(winner===1) roundWins.p1++; else roundWins.p2++;
    scoreText.textContent = `${roundWins.p1} - ${roundWins.p2}`;

    const cpuLabel = (mode==="cpu") ? "CPU" : "Jugador 2";
    const wName = (winner===1) ? "Jugador 1" : cpuLabel;
    const lName = (loser===1) ? "Jugador 1" : cpuLabel;

    const seriesWon = (roundWins.p1>=roundNeed || roundWins.p2>=roundNeed);
    if(seriesWon){
      permStats.games += 1;
      if(mode==="cpu"){
        if(winner===1) permStats.wins_p1 += 1;
        else permStats.cpu_wins += 1;
      }else{
        if(winner===1) permStats.wins_p1 += 1;
        else permStats.wins_p2 += 1;
      }
      saveStats();
      refreshStatsLine();

      showOverlay("¡SERIE!", `${wName} gana la serie`, `${lName} quitó el último y perdió.`);
      // reset for next series
      roundWins={p1:0,p2:0};
      scoreText.textContent="0 - 0";
      persistSave();
      return;
    }

    showOverlay("¡RONDA!", `${wName} gana la ronda`, `${lName} quitó el último y perdió.`);
    persistSave();
  }

  // Buttons
  btnStart.addEventListener("click", ()=>{
    if(gameStarted) return;
    gameStarted = true;
    btnStart.disabled = true;
    btnNew.disabled = false;
    toast("¡A jugar!");
    startNewRound();
  });

  btnFinish.addEventListener("click", ()=>{
    if(!gameStarted) return;
    if(selected.length===0 || activeRow===null) return;
    stopTimer();
    finishMove(activeRow, selected.slice(), false);
  });

  btnUndo.addEventListener("click", ()=>{
    if(history.length===0) return;
    if(undoUsedThisRound>=undoLimit) return;

    const prev=history.pop();
    state = prev.state.map(r=>r.slice());
    blocked = prev.blocked.map(r=>r.slice());
    currentPlayer = prev.currentPlayer;
    roundWins = {...prev.roundWins};
    undoUsedThisRound = prev.undoUsedThisRound + 1; // consume undo
    selected=[]; activeRow=null; dragging=false;
    toast("Deshecho");
    beep(260,0.06,"triangle",0.05);
    render();
    persistSave();
    startTimer();
  });

  btnNew.addEventListener("click", ()=>{
    if(!gameStarted) return;
    hideOverlay();
    startNewRound();
  });

  // Settings modal
  function openSettings(){
    settingsBackdrop.classList.add("show");
    settingsModal.classList.add("show");
    settingsBackdrop.setAttribute("aria-hidden","false");
    stopTimer();
  }
  function closeSettings(){
    settingsBackdrop.classList.remove("show");
    settingsModal.classList.remove("show");
    settingsBackdrop.setAttribute("aria-hidden","true");
    if(gameStarted) startTimer();
  }
  btnSettings.addEventListener("click", openSettings);
  btnCloseSettings.addEventListener("click", closeSettings);
  settingsBackdrop.addEventListener("click", closeSettings);

  function applyProfessorRules(rebuild=true){
    if(professor){
      ROWS=[7,5,3];
      rowA.value="7"; rowB.value="5"; rowC.value="3";
      rowA.disabled = true; rowB.disabled = true; rowC.disabled = true;
    }else{
      rowA.disabled = false; rowB.disabled = false; rowC.disabled = false;
    }
    if(rebuild && gameStarted) startNewRound();
  }

  function applyChallenge(rebuild=true){
    // reset to current base, then apply
    if(challenge==="max2"){ maxRemove=2; maxRemoveEl.value="2"; }
    if(challenge==="blitz10"){ blitzSeconds=10; blitzSelect.value="10"; }
    if(challenge==="noundo"){ undoLimit=0; undoLimitEl.value="0"; }
    if(rebuild && gameStarted) startNewRound();
  }

  btnApplySettings.addEventListener("click", ()=>{
    // read settings
    mode = modeSelect.value;
    players = parseInt(playersSelect.value,10);
    cpuLevel = cpuSelect.value;
    cpuPersona = cpuPersonaEl.value;
    learning = (learnSelect.value==="1");
    startMode = startSelect.value;
    seriesLen = parseInt(seriesSelect.value,10);
    blitzSeconds = parseInt(blitzSelect.value,10);
    obstaclesPerRow = parseInt(obstaclesSelect.value,10);
    undoLimit = parseInt(undoLimitEl.value,10);
    maxRemove = parseInt(maxRemoveEl.value,10);

    ROWS = [
      clamp(parseInt(rowA.value||"7",10),1,15),
      clamp(parseInt(rowB.value||"5",10),1,15),
      clamp(parseInt(rowC.value||"3",10),1,15),
    ];

    focus = (focusSelect.value==="1");
    professor = (profSelect.value==="1");
    challenge = challengeSelect.value;
    autoSave = (saveSelect.value==="1");

    applyProfessorRules(false);
    applyChallenge(false);

    // focus css
    document.body.classList.toggle("focus", focus);

    updateRoundNeed();
    applySkin();

    // reset series score if series/mode changed (simple)
    roundWins={p1:0,p2:0};
    scoreText.textContent="0 - 0";

    closeSettings();

    if(gameStarted) startNewRound();
    else{
      buildNewRoundState();
      rebuildDOMFromState();
      render();
    }

    toast("Ajustes aplicados");
    persistSave();
  });

  btnClearSave.addEventListener("click", ()=>{
    clearSavedGame();
    toast("Guardado borrado");
  });

  // Overlay controls
  btnCloseOverlay.addEventListener("click", ()=>{ hideOverlay(); });
  btnNext.addEventListener("click", ()=>{
    hideOverlay();
    if(!gameStarted) return;
    startNewRound();
  });

  // Resume overlay
  function showResume(){
    resumeOverlay.classList.add("show");
    resumeOverlay.setAttribute("aria-hidden","false");
  }
  function hideResume(){
    resumeOverlay.classList.remove("show");
    resumeOverlay.setAttribute("aria-hidden","true");
  }
  btnCloseResume.addEventListener("click", ()=>{ hideResume(); });
  btnResume.addEventListener("click", ()=>{
    hideResume();
    try{
      const raw=localStorage.getItem(SAVE_KEY);
      if(!raw){ toast("No hay guardado"); return; }
      importSave(JSON.parse(raw));
      toast("Continuado");
    }catch{ toast("Guardado inválido"); }
  });
  btnDiscard.addEventListener("click", ()=>{
    hideResume();
    clearSavedGame();
    // reset to fresh idle
    gameStarted=false;
    btnStart.disabled=false;
    btnNew.disabled=true;
    roundWins={p1:0,p2:0};
    scoreText.textContent="0 - 0";
    buildNewRoundState();
    rebuildDOMFromState();
    stopTimer();
    render();
    toast("Nuevo inicio");
  });

  // CPU helper functions (brute force with memo, respects obstacles and maxRemove)
  const memo = new Map();
  function key(st){
    return st.map(row=>row.map(v=>v?1:0).join("")).join("|");
  }
  function over(st){
    for(let r=0;r<3;r++) for(let i=0;i<ROWS[r];i++) if(st[r][i] && !blocked[r][i]) return false;
    return true;
  }
  function movesForRow(r, st){
    const runs=[];
    let i=0;
    while(i<ROWS[r]){
      while(i<ROWS[r] && (!st[r][i] || blocked[r][i])) i++;
      if(i>=ROWS[r]) break;
      let j=i;
      while(j<ROWS[r] && (st[r][j] && !blocked[r][j])) j++;
      runs.push([i,j-1]); i=j;
    }
    const moves=[];
    for(const [a,b] of runs){
      for(let i0=a;i0<=b;i0++){
        for(let i1=i0;i1<=b;i1++){
          const len = i1-i0+1;
          if(maxRemove>0 && len>maxRemove) continue;
          const idxs=[];
          for(let k=i0;k<=i1;k++) idxs.push(k);
          moves.push({row:r, idxs, len});
        }
      }
    }
    return moves;
  }
  function allMoves(st){
    const moves=[];
    for(let r=0;r<3;r++) moves.push(...movesForRow(r, st));
    return moves;
  }
  // Misère: if no moves => current player WINS (because previous player took last and lost)
  function winPos(st){
    const k=key(st);
    if(memo.has(k)) return memo.get(k);
    if(over(st)){ memo.set(k,true); return true; }
    const moves=allMoves(st);
    for(const mv of moves){
      const ns=st.map(r=>r.slice());
      mv.idxs.forEach(i=>ns[mv.row][i]=false);
      if(!winPos(ns)){ memo.set(k,true); return true; }
    }
    memo.set(k,false); return false;
  }

  function pickCpuMove(){
    const st=state.map(r=>r.slice());
    const moves=allMoves(st);
    if(moves.length===0) return null;

    memo.clear();
    const winning = moves.filter(mv=>{
      const ns=st.map(r=>r.slice());
      mv.idxs.forEach(i=>ns[mv.row][i]=false);
      return !winPos(ns);
    });

    const rand = (arr)=>arr[Math.floor(Math.random()*arr.length)];

    // personality: choose among winning moves, if any
    let pool = winning.length ? winning : moves;

    if(cpuPersona==="troll"){
      // fail on purpose sometimes
      if(winning.length && Math.random()<0.45) pool = moves;
      if(winning.length && Math.random()<0.25) pool = winning;
    }
    if(cpuPersona==="conservative"){
      const minLen = Math.min(...pool.map(m=>m.len));
      const mins = pool.filter(m=>m.len===minLen);
      pool = mins.length ? mins : pool;
    }
    if(cpuPersona==="aggressive"){
      const maxLen = Math.max(...pool.map(m=>m.len));
      const maxs = pool.filter(m=>m.len===maxLen);
      pool = maxs.length ? maxs : pool;
    }
    // difficulty: degrade selection
    if(cpuLevel==="random") pool = moves;
    if(cpuLevel==="easy"){ if(winning.length && Math.random()<0.25) pool = winning; else pool = moves; }
    if(cpuLevel==="medium"){ if(winning.length && Math.random()<0.55) pool = winning; else pool = moves; }
    if(cpuLevel==="hard"){ if(winning.length && Math.random()<0.80) pool = winning; else pool = moves; }
    if(cpuLevel==="expert"){ if(winning.length && Math.random()<0.93) pool = winning; else pool = moves; }
    // optimal: keep pool as chosen above

    const mv = rand(pool);

    // explanation (simple)
    let explain = "";
    if(learning){
      if(winning.length){
        explain = "Dejo una posición perdedora para ti.";
      }else{
        explain = "No hay jugada ganadora; elijo la mejor disponible.";
      }
      if(cpuPersona==="conservative") explain += " (Conservadora)";
      if(cpuPersona==="aggressive") explain += " (Agresiva)";
      if(cpuPersona==="troll") explain += " (Tramposa)";
    }
    return { ...mv, explain, isWinning: winning.length>0 };
  }

  function cpuMoveSoon(){
    stopTimer();
    render();
    setTimeout(()=>{
      if(!gameStarted) return;
      if(overlay.classList.contains("show") || resumeOverlay.classList.contains("show")) return;
      if(!(mode==="cpu" && currentPlayer===2)) return;

      const mv = pickCpuMove();
      if(!mv) return;

      if(mv.explain) toast("CPU: " + mv.explain);

      activeRow = mv.row;
      selected = mv.idxs.slice();
      render();
      beep(220,0.07,"sine",0.06);

      setTimeout(()=>{
        stopTimer();
        finishMove(mv.row, mv.idxs, false);
      }, 260);
    }, 340);
  }

  // Resume check
  function checkSavedGame(){
    if(saveSelect.value!=="1") return;
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return;
      // show resume prompt only if it looks valid
      const obj = JSON.parse(raw);
      if(obj && obj.run && obj.run.state) showResume();
    }catch{}
  }

  // Init
  loadStats();
  refreshStatsLine();

  // defaults to UI
  applySkin();
  updateRoundNeed();
  // build initial board (idle)
  buildNewRoundState();
  rebuildDOMFromState();
  stopTimer();
  render();
  toast("Pulsa Iniciar");
  checkSavedGame();

  // If autosave off, ensure no resume popup
  saveSelect.addEventListener("change", ()=>{
    autoSave = (saveSelect.value==="1");
    if(!autoSave) hideResume();
  });

})();

