function normChar(ch){
  if(!ch) return "";
  let s = ch.toLowerCase();
  s = s.replace(/ñ/g, "§");
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/§/g, "ñ");
  return s;
}

const LIB = [
  // Objetos (100)
  {w:"mesa",c:"Objetos"},{w:"silla",c:"Objetos"},{w:"cama",c:"Objetos"},{w:"sofá",c:"Objetos"},{w:"lámpara",c:"Objetos"},
  {w:"cortina",c:"Objetos"},{w:"alfombra",c:"Objetos"},{w:"espejo",c:"Objetos"},{w:"cuadro",c:"Objetos"},{w:"reloj",c:"Objetos"},
  {w:"llave",c:"Objetos"},{w:"candado",c:"Objetos"},{w:"puerta",c:"Objetos"},{w:"ventana",c:"Objetos"},{w:"techo",c:"Objetos"},
  {w:"pared",c:"Objetos"},{w:"suelo",c:"Objetos"},{w:"cajón",c:"Objetos"},{w:"armario",c:"Objetos"},{w:"estante",c:"Objetos"},
  {w:"libro",c:"Objetos"},{w:"cuaderno",c:"Objetos"},{w:"lápiz",c:"Objetos"},{w:"bolígrafo",c:"Objetos"},{w:"goma",c:"Objetos"},
  {w:"regla",c:"Objetos"},{w:"tijeras",c:"Objetos"},{w:"pegamento",c:"Objetos"},{w:"carpeta",c:"Objetos"},{w:"mochila",c:"Objetos"},
  {w:"botella",c:"Objetos"},{w:"vaso",c:"Objetos"},{w:"plato",c:"Objetos"},{w:"cuchara",c:"Objetos"},{w:"tenedor",c:"Objetos"},
  {w:"cuchillo",c:"Objetos"},{w:"sartén",c:"Objetos"},{w:"olla",c:"Objetos"},{w:"taza",c:"Objetos"},{w:"tetera",c:"Objetos"},
  {w:"cafetera",c:"Objetos"},{w:"microondas",c:"Objetos"},{w:"horno",c:"Objetos"},{w:"nevera",c:"Objetos"},{w:"congelador",c:"Objetos"},
  {w:"fregadero",c:"Objetos"},{w:"grifo",c:"Objetos"},{w:"esponja",c:"Objetos"},{w:"jabón",c:"Objetos"},{w:"toalla",c:"Objetos"},
  {w:"cepillo",c:"Objetos"},{w:"peine",c:"Objetos"},{w:"secador",c:"Objetos"},{w:"cargador",c:"Objetos"},{w:"teléfono",c:"Objetos"},
  {w:"tableta",c:"Objetos"},{w:"ordenador",c:"Objetos"},{w:"teclado",c:"Objetos"},{w:"ratonera",c:"Objetos"},{w:"pantalla",c:"Objetos"},
  {w:"altavoz",c:"Objetos"},{w:"auricular",c:"Objetos"},{w:"cámara",c:"Objetos"},{w:"trípode",c:"Objetos"},{w:"linterna",c:"Objetos"},
  {w:"batería",c:"Objetos"},{w:"cable",c:"Objetos"},{w:"enchufe",c:"Objetos"},{w:"interruptor",c:"Objetos"},{w:"bombilla",c:"Objetos"},
  {w:"cinta",c:"Objetos"},{w:"clavo",c:"Objetos"},{w:"tornillo",c:"Objetos"},{w:"martillo",c:"Objetos"},{w:"taladro",c:"Objetos"},
  {w:"sierra",c:"Objetos"},{w:"nivel",c:"Objetos"},{w:"escalera",c:"Objetos"},{w:"cuerda",c:"Objetos"},{w:"cadena",c:"Objetos"},
  {w:"imán",c:"Objetos"},{w:"brújula",c:"Objetos"},{w:"mapa",c:"Objetos"},{w:"maleta",c:"Objetos"},{w:"paraguas",c:"Objetos"},
  {w:"sombrero",c:"Objetos"},{w:"chaqueta",c:"Objetos"},{w:"camisa",c:"Objetos"},{w:"pantalón",c:"Objetos"},{w:"zapato",c:"Objetos"},
  {w:"calcetín",c:"Objetos"},{w:"cinturón",c:"Objetos"},{w:"guante",c:"Objetos"},{w:"bufanda",c:"Objetos"},{w:"anillo",c:"Objetos"},
  {w:"collar",c:"Objetos"},{w:"pulsera",c:"Objetos"},{w:"moneda",c:"Objetos"},{w:"billete",c:"Objetos"},{w:"cartera",c:"Objetos"},

  // Animales (100)
  {w:"perro",c:"Animales"},{w:"gato",c:"Animales"},{w:"caballo",c:"Animales"},{w:"vaca",c:"Animales"},{w:"oveja",c:"Animales"},
  {w:"cabra",c:"Animales"},{w:"cerdo",c:"Animales"},{w:"burro",c:"Animales"},{w:"conejo",c:"Animales"},{w:"ratón",c:"Animales"},
  {w:"hamster",c:"Animales"},{w:"ardilla",c:"Animales"},{w:"zorro",c:"Animales"},{w:"lobo",c:"Animales"},{w:"oso",c:"Animales"},
  {w:"tigre",c:"Animales"},{w:"león",c:"Animales"},{w:"pantera",c:"Animales"},{w:"jaguar",c:"Animales"},{w:"puma",c:"Animales"},
  {w:"cebra",c:"Animales"},{w:"jirafa",c:"Animales"},{w:"elefante",c:"Animales"},{w:"rinoceronte",c:"Animales"},{w:"hipopótamo",c:"Animales"},
  {w:"canguro",c:"Animales"},{w:"koala",c:"Animales"},{w:"mono",c:"Animales"},{w:"gorila",c:"Animales"},{w:"chimpancé",c:"Animales"},
  {w:"orangután",c:"Animales"},{w:"perezoso",c:"Animales"},{w:"nutria",c:"Animales"},{w:"castor",c:"Animales"},{w:"mapache",c:"Animales"},
  {w:"marmota",c:"Animales"},{w:"topo",c:"Animales"},{w:"murciélago",c:"Animales"},{w:"erizo",c:"Animales"},{w:"ciervo",c:"Animales"},
  {w:"alce",c:"Animales"},{w:"jabalí",c:"Animales"},{w:"búfalo",c:"Animales"},{w:"bisonte",c:"Animales"},{w:"camello",c:"Animales"},
  {w:"dromedario",c:"Animales"},{w:"llama",c:"Animales"},{w:"alpaca",c:"Animales"},{w:"hiena",c:"Animales"},{w:"chacal",c:"Animales"},
  {w:"suricata",c:"Animales"},{w:"foca",c:"Animales"},{w:"delfín",c:"Animales"},{w:"ballena",c:"Animales"},{w:"tiburón",c:"Animales"},
  {w:"mantarraya",c:"Animales"},{w:"pulpo",c:"Animales"},{w:"calamar",c:"Animales"},{w:"cangrejo",c:"Animales"},{w:"langosta",c:"Animales"},
  {w:"gamba",c:"Animales"},{w:"medusa",c:"Animales"},{w:"salmón",c:"Animales"},{w:"trucha",c:"Animales"},{w:"bacalao",c:"Animales"},
  {w:"atún",c:"Animales"},{w:"sardina",c:"Animales"},{w:"anguila",c:"Animales"},{w:"carpa",c:"Animales"},{w:"piraña",c:"Animales"},
  {w:"cocodrilo",c:"Animales"},{w:"caimán",c:"Animales"},{w:"lagarto",c:"Animales"},{w:"iguana",c:"Animales"},{w:"camaleón",c:"Animales"},
  {w:"serpiente",c:"Animales"},{w:"víbora",c:"Animales"},{w:"pitón",c:"Animales"},{w:"tortuga",c:"Animales"},{w:"galápago",c:"Animales"},
  {w:"rana",c:"Animales"},{w:"sapo",c:"Animales"},{w:"salamandra",c:"Animales"},{w:"tritón",c:"Animales"},{w:"águila",c:"Animales"},
  {w:"halcón",c:"Animales"},{w:"búho",c:"Animales"},{w:"lechuza",c:"Animales"},{w:"paloma",c:"Animales"},{w:"gorrión",c:"Animales"},
  {w:"cuervo",c:"Animales"},{w:"loro",c:"Animales"},{w:"canario",c:"Animales"},{w:"pingüino",c:"Animales"},{w:"avestruz",c:"Animales"},
  {w:"flamenco",c:"Animales"},{w:"cisne",c:"Animales"},{w:"pavo",c:"Animales"},{w:"gallina",c:"Animales"},{w:"gallo",c:"Animales"},

  // Profesiones (100)
  {w:"médico",c:"Profesiones"},{w:"enfermero",c:"Profesiones"},{w:"cirujano",c:"Profesiones"},{w:"dentista",c:"Profesiones"},{w:"farmacéutico",c:"Profesiones"},
  {w:"veterinario",c:"Profesiones"},{w:"psicólogo",c:"Profesiones"},{w:"fisioterapeuta",c:"Profesiones"},{w:"optometrista",c:"Profesiones"},{w:"paramédico",c:"Profesiones"},
  {w:"bombero",c:"Profesiones"},{w:"policía",c:"Profesiones"},{w:"guardia",c:"Profesiones"},{w:"soldado",c:"Profesiones"},{w:"piloto",c:"Profesiones"},
  {w:"azafata",c:"Profesiones"},{w:"conductor",c:"Profesiones"},{w:"maquinista",c:"Profesiones"},{w:"marinero",c:"Profesiones"},{w:"capitán",c:"Profesiones"},
  {w:"ingeniero",c:"Profesiones"},{w:"arquitecto",c:"Profesiones"},{w:"diseñador",c:"Profesiones"},{w:"programador",c:"Profesiones"},{w:"analista",c:"Profesiones"},
  {w:"técnico",c:"Profesiones"},{w:"mecánico",c:"Profesiones"},{w:"electricista",c:"Profesiones"},{w:"fontanero",c:"Profesiones"},{w:"carpintero",c:"Profesiones"},
  {w:"albañil",c:"Profesiones"},{w:"pintor",c:"Profesiones"},{w:"soldador",c:"Profesiones"},{w:"jardinero",c:"Profesiones"},{w:"agricultor",c:"Profesiones"},
  {w:"ganadero",c:"Profesiones"},{w:"pescador",c:"Profesiones"},{w:"minero",c:"Profesiones"},{w:"geólogo",c:"Profesiones"},{w:"topógrafo",c:"Profesiones"},
  {w:"profesor",c:"Profesiones"},{w:"maestro",c:"Profesiones"},{w:"tutor",c:"Profesiones"},{w:"bibliotecario",c:"Profesiones"},{w:"investigador",c:"Profesiones"},
  {w:"científico",c:"Profesiones"},{w:"químico",c:"Profesiones"},{w:"biólogo",c:"Profesiones"},{w:"físico",c:"Profesiones"},{w:"matemático",c:"Profesiones"},
  {w:"astrónomo",c:"Profesiones"},{w:"periodista",c:"Profesiones"},{w:"escritor",c:"Profesiones"},{w:"editor",c:"Profesiones"},{w:"traductor",c:"Profesiones"},
  {w:"abogado",c:"Profesiones"},{w:"juez",c:"Profesiones"},{w:"fiscal",c:"Profesiones"},{w:"notario",c:"Profesiones"},{w:"contador",c:"Profesiones"},
  {w:"auditor",c:"Profesiones"},{w:"economista",c:"Profesiones"},{w:"banquero",c:"Profesiones"},{w:"cajero",c:"Profesiones"},{w:"vendedor",c:"Profesiones"},
  {w:"comercial",c:"Profesiones"},{w:"camarero",c:"Profesiones"},{w:"cocinero",c:"Profesiones"},{w:"chef",c:"Profesiones"},{w:"panadero",c:"Profesiones"},
  {w:"pastelero",c:"Profesiones"},{w:"carnicero",c:"Profesiones"},{w:"pescadero",c:"Profesiones"},{w:"frutero",c:"Profesiones"},{w:"repartidor",c:"Profesiones"},
  {w:"mensajero",c:"Profesiones"},{w:"recepcionista",c:"Profesiones"},{w:"secretario",c:"Profesiones"},{w:"asistente",c:"Profesiones"},{w:"gerente",c:"Profesiones"},
  {w:"director",c:"Profesiones"},{w:"administrador",c:"Profesiones"},{w:"consultor",c:"Profesiones"},{w:"asesor",c:"Profesiones"},{w:"entrenador",c:"Profesiones"},
  {w:"árbitro",c:"Profesiones"},{w:"deportista",c:"Profesiones"},{w:"músico",c:"Profesiones"},{w:"cantante",c:"Profesiones"},{w:"actor",c:"Profesiones"},
  {w:"actriz",c:"Profesiones"},{w:"fotógrafo",c:"Profesiones"},{w:"camarógrafo",c:"Profesiones"},{w:"ilustrador",c:"Profesiones"},{w:"barbero",c:"Profesiones"},
  {w:"peluquero",c:"Profesiones"},{w:"estilista",c:"Profesiones"},{w:"joyero",c:"Profesiones"},{w:"sastre",c:"Profesiones"},{w:"zapatero",c:"Profesiones"},

  // Lugares (100)
  {w:"casa",c:"Lugares"},{w:"hogar",c:"Lugares"},{w:"piso",c:"Lugares"},{w:"barrio",c:"Lugares"},{w:"calle",c:"Lugares"},
  {w:"avenida",c:"Lugares"},{w:"plaza",c:"Lugares"},{w:"parque",c:"Lugares"},{w:"jardín",c:"Lugares"},{w:"bosque",c:"Lugares"},
  {w:"selva",c:"Lugares"},{w:"desierto",c:"Lugares"},{w:"montaña",c:"Lugares"},{w:"valle",c:"Lugares"},{w:"colina",c:"Lugares"},
  {w:"pradera",c:"Lugares"},{w:"playa",c:"Lugares"},{w:"costa",c:"Lugares"},{w:"acantilado",c:"Lugares"},{w:"isla",c:"Lugares"},
  {w:"península",c:"Lugares"},{w:"bahía",c:"Lugares"},{w:"puerto",c:"Lugares"},{w:"río",c:"Lugares"},{w:"arroyo",c:"Lugares"},
  {w:"lago",c:"Lugares"},{w:"laguna",c:"Lugares"},{w:"cascada",c:"Lugares"},{w:"pantano",c:"Lugares"},{w:"cueva",c:"Lugares"},
  {w:"mina",c:"Lugares"},{w:"cantera",c:"Lugares"},{w:"túnel",c:"Lugares"},{w:"puente",c:"Lugares"},{w:"carretera",c:"Lugares"},
  {w:"autopista",c:"Lugares"},{w:"estación",c:"Lugares"},{w:"aeropuerto",c:"Lugares"},{w:"muelle",c:"Lugares"},{w:"mercado",c:"Lugares"},
  {w:"tienda",c:"Lugares"},{w:"supermercado",c:"Lugares"},{w:"panadería",c:"Lugares"},{w:"farmacia",c:"Lugares"},{w:"hospital",c:"Lugares"},
  {w:"clínica",c:"Lugares"},{w:"escuela",c:"Lugares"},{w:"instituto",c:"Lugares"},{w:"universidad",c:"Lugares"},{w:"biblioteca",c:"Lugares"},
  {w:"museo",c:"Lugares"},{w:"teatro",c:"Lugares"},{w:"cine",c:"Lugares"},{w:"estadio",c:"Lugares"},{w:"gimnasio",c:"Lugares"},
  {w:"piscina",c:"Lugares"},{w:"restaurante",c:"Lugares"},{w:"cafetería",c:"Lugares"},{w:"bar",c:"Lugares"},{w:"hotel",c:"Lugares"},
  {w:"hostal",c:"Lugares"},{w:"camping",c:"Lugares"},{w:"iglesia",c:"Lugares"},{w:"templo",c:"Lugares"},{w:"mezquita",c:"Lugares"},
  {w:"sinagoga",c:"Lugares"},{w:"ayuntamiento",c:"Lugares"},{w:"comisaría",c:"Lugares"},{w:"cuartel",c:"Lugares"},{w:"tribunal",c:"Lugares"},
  {w:"oficina",c:"Lugares"},{w:"fábrica",c:"Lugares"},{w:"taller",c:"Lugares"},{w:"almacén",c:"Lugares"},{w:"laboratorio",c:"Lugares"},
  {w:"granja",c:"Lugares"},{w:"invernadero",c:"Lugares"},{w:"viñedo",c:"Lugares"},{w:"bodega",c:"Lugares"},{w:"puerto seco",c:"Lugares"},
  {w:"frontera",c:"Lugares"},{w:"aduana",c:"Lugares"},{w:"mirador",c:"Lugares"},{w:"sendero",c:"Lugares"},{w:"refugio",c:"Lugares"},
  {w:"campamento",c:"Lugares"},{w:"catedral",c:"Lugares"},{w:"castillo",c:"Lugares"},{w:"palacio",c:"Lugares"},{w:"torre",c:"Lugares"},
  {w:"muralla",c:"Lugares"},{w:"monasterio",c:"Lugares"},{w:"cementerio",c:"Lugares"},{w:"tumba",c:"Lugares"},
  {w:"embalse",c:"Lugares"},{w:"glaciar",c:"Lugares"},{w:"volcán",c:"Lugares"},{w:"observatorio",c:"Lugares"},{w:"polígono",c:"Lugares"},{w:"metro",c:"Lugares"},

  // Verbos (100)
  {w:"amar",c:"Verbos"},{w:"odiar",c:"Verbos"},{w:"temer",c:"Verbos"},{w:"vivir",c:"Verbos"},{w:"soñar",c:"Verbos"},
  {w:"reír",c:"Verbos"},{w:"oír",c:"Verbos"},{w:"ir",c:"Verbos"},{w:"venir",c:"Verbos"},{w:"salir",c:"Verbos"},
  {w:"entrar",c:"Verbos"},{w:"subir",c:"Verbos"},{w:"bajar",c:"Verbos"},{w:"correr",c:"Verbos"},{w:"saltar",c:"Verbos"},
  {w:"nadar",c:"Verbos"},{w:"volar",c:"Verbos"},{w:"caminar",c:"Verbos"},{w:"andar",c:"Verbos"},{w:"viajar",c:"Verbos"},
  {w:"mirar",c:"Verbos"},{w:"ver",c:"Verbos"},{w:"escuchar",c:"Verbos"},{w:"hablar",c:"Verbos"},{w:"decir",c:"Verbos"},
  {w:"contar",c:"Verbos"},{w:"callar",c:"Verbos"},{w:"gritar",c:"Verbos"},{w:"cantar",c:"Verbos"},{w:"bailar",c:"Verbos"},
  {w:"repetir",c:"Verbos"},{w:"aprender",c:"Verbos"},{w:"enseñar",c:"Verbos"},{w:"leer",c:"Verbos"},{w:"escribir",c:"Verbos"},
  {w:"dibujar",c:"Verbos"},{w:"pintar",c:"Verbos"},{w:"cocinar",c:"Verbos"},{w:"comer",c:"Verbos"},{w:"beber",c:"Verbos"},
  {w:"probar",c:"Verbos"},{w:"oler",c:"Verbos"},{w:"tocar",c:"Verbos"},{w:"sentir",c:"Verbos"},{w:"pensar",c:"Verbos"},
  {w:"creer",c:"Verbos"},{w:"dudar",c:"Verbos"},{w:"saber",c:"Verbos"},{w:"conocer",c:"Verbos"},{w:"olvidar",c:"Verbos"},
  {w:"recordar",c:"Verbos"},{w:"buscar",c:"Verbos"},{w:"encontrar",c:"Verbos"},{w:"perder",c:"Verbos"},{w:"ganar",c:"Verbos"},
  {w:"pagar",c:"Verbos"},{w:"cobrar",c:"Verbos"},{w:"comprar",c:"Verbos"},{w:"vender",c:"Verbos"},{w:"prestar",c:"Verbos"},
  {w:"devolver",c:"Verbos"},{w:"abrir",c:"Verbos"},{w:"cerrar",c:"Verbos"},{w:"romper",c:"Verbos"},{w:"arreglar",c:"Verbos"},
  {w:"limpiar",c:"Verbos"},{w:"lavar",c:"Verbos"},{w:"secar",c:"Verbos"},{w:"planchar",c:"Verbos"},{w:"cortar",c:"Verbos"},
  {w:"pegar",c:"Verbos"},{w:"mover",c:"Verbos"},{w:"parar",c:"Verbos"},{w:"empezar",c:"Verbos"},{w:"terminar",c:"Verbos"},
  {w:"cambiar",c:"Verbos"},{w:"mejorar",c:"Verbos"},{w:"ayudar",c:"Verbos"},{w:"molestar",c:"Verbos"},{w:"esperar",c:"Verbos"},
  {w:"lograr",c:"Verbos"},{w:"fallar",c:"Verbos"},{w:"crear",c:"Verbos"},{w:"construir",c:"Verbos"},{w:"destruir",c:"Verbos"},
  {w:"proteger",c:"Verbos"},{w:"atacar",c:"Verbos"},{w:"defender",c:"Verbos"},{w:"cuidar",c:"Verbos"},{w:"curar",c:"Verbos"},
  {w:"jugar",c:"Verbos"},{w:"llamar",c:"Verbos"},{w:"responder",c:"Verbos"},{w:"preguntar",c:"Verbos"},{w:"elegir",c:"Verbos"},
  {w:"decidir",c:"Verbos"},{w:"permitir",c:"Verbos"},{w:"negar",c:"Verbos"},{w:"aceptar",c:"Verbos"},{w:"sonreír",c:"Verbos"}
];

if(LIB.length !== 500) console.warn("LIB no tiene 500:", LIB.length);

/* ===== UI refs ===== */
const wordView = document.getElementById("wordView");
const wrongView = document.getElementById("wrongView");
const catPill = document.getElementById("catPill");
const triesPill = document.getElementById("triesPill");
const modePill = document.getElementById("modePill");
const msg = document.getElementById("msg");
const metaMsg = document.getElementById("metaMsg");
const resultMsg = document.getElementById("resultMsg");
const keyboard = document.getElementById("keyboard");
const svgBox = document.getElementById("svgBox");
const flash = document.getElementById("flash");

const newBtn = document.getElementById("newBtn");
const hintBtn = document.getElementById("hintBtn");
const wildBtn = document.getElementById("wildBtn");
const revealBtn = document.getElementById("revealBtn");
const skipBtn = document.getElementById("skipBtn");

const settingsBtn = document.getElementById("settingsBtn");
const overlay = document.getElementById("overlay");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");

const modeSel = document.getElementById("modeSel");
const diffSel = document.getElementById("diffSel");
const categoryHintChk = document.getElementById("categoryHintChk");
const dailyChk = document.getElementById("dailyChk");
const stallSecView = document.getElementById("stallSec");

const sfxChk = document.getElementById("sfxChk");
const musicChk = document.getElementById("musicChk");
const audioBtn = document.getElementById("audioBtn");

const turnView = document.getElementById("turnView");
const timeLeftView = document.getElementById("timeLeft");
const timeBar = document.getElementById("timeBar");

const p1Pts = document.getElementById("p1Pts");
const p2Pts = document.getElementById("p2Pts");
const p1Hits = document.getElementById("p1Hits");
const p2Hits = document.getElementById("p2Hits");
const p1Fails = document.getElementById("p1Fails");
const p2Fails = document.getElementById("p2Fails");
const p1Turn = document.getElementById("p1Turn");
const p2Turn = document.getElementById("p2Turn");
const p1Streak = document.getElementById("p1Streak");
const p2Streak = document.getElementById("p2Streak");
const scoreArea = document.getElementById("scoreArea");

const PARTS = ["p_head","p_body","p_larm","p_rarm","p_lleg","p_rleg","p_eyes"].map(id => document.getElementById(id));

/* ===== Audio ===== */
let audioCtx=null, master=null, audioUnlocked=false;
let musicInterval=null, musicStep=0;

function ensureAudio(){
  if(audioCtx) return true;
  try{
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.12;
    master.connect(audioCtx.destination);
    return true;
  }catch(e){ return false; }
}
function unlockAudio(){
  if(!ensureAudio()) return false;
  if(audioCtx.state === "suspended") audioCtx.resume();
  audioUnlocked = true;
  return true;
}
function tone(freq, dur, type="sine", vol=0.25){
  if(!audioUnlocked) return;
  const t0 = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
function sfx(fn){ if(sfxChk.checked) fn(); }
function sfx_ok(){ sfx(()=>{ tone(660,0.07,"triangle",0.22); setTimeout(()=>tone(880,0.07,"triangle",0.22),70); }); }
function sfx_bad(){ sfx(()=>{ tone(220,0.11,"sawtooth",0.25); setTimeout(()=>tone(165,0.12,"sawtooth",0.20),110); }); }
function sfx_tick(){ sfx(()=>tone(880,0.03,"square",0.10)); }
function sfx_win(){ sfx(()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,0.12,"triangle",0.22), i*110))); }
function sfx_lose(){ sfx(()=>[392,330,262,196].forEach((f,i)=>setTimeout(()=>tone(f,0.16,"sine",0.18), i*150))); }
function sfx_last(){ sfx(()=>{ tone(130.81,0.22,"sawtooth",0.22); setTimeout(()=>tone(98.00,0.26,"sawtooth",0.20),120); }); }

function stopMusic(){ if(musicInterval){ clearInterval(musicInterval); musicInterval=null; } }
function startMusic(){
  stopMusic();
  if(!musicChk.checked) return;
  if(!audioUnlocked) return;
  const chords = [
    {lead:[440,523,659,523], bass:110},     // Am
    {lead:[349,440,523,440], bass:87.31},  // F
    {lead:[392,523,659,523], bass:65.41},  // C
    {lead:[392,493.88,587.33,493.88], bass:98.00} // G
  ];
  const stepMs = 240;
  musicStep = 0;
  musicInterval = setInterval(()=>{
    if(!musicChk.checked || !audioUnlocked){ stopMusic(); return; }
    const bar = Math.floor(musicStep / 4) % chords.length;
    const beat = musicStep % 4;
    if(beat === 0 || beat === 2) tone(chords[bar].bass, 0.12, "sine", 0.10);
    tone(chords[bar].lead[beat], 0.10, "triangle", 0.11);
    tone(1800, 0.02, "square", 0.03);
    musicStep++;
  }, stepMs);
}

/* ===== Settings ===== */
const DIFF = {
  easy:   { maxFails: 8, turnSeconds: 12, minLen: 4, maxLen: 12, showCat: true, stallSeconds: 18 },
  normal: { maxFails: 7, turnSeconds: 9,  minLen: 5, maxLen: 12, showCat: true, stallSeconds: 15 },
  hard:   { maxFails: 6, turnSeconds: 7,  minLen: 6, maxLen: 12, showCat: false, stallSeconds: 12 },
};

/* ===== State ===== */
let secret="", category="";
let revealed=[];
let used=new Set();
let fails=0, maxFails=7;
let ended=false;

let mode="solo";   // solo | versus | duelo
let turn=1;
let duelPhase=0;
let duelSecret={1:"",2:""}, duelCategory={1:"",2:""};

let p = {
  1:{pts:0,hits:0,fails:0,streak:0,wildUsed:false},
  2:{pts:0,hits:0,fails:0,streak:0,wildUsed:false},
};

let turnSeconds=9, timeLeft=0, timer=null;
let timerArmed=false;
let stallSeconds=15, stallTimer=null, stallLeft=15;

/* RNG for daily word */
function dateKey(){
  const d=new Date();
  const yyyy=d.getFullYear();
  const mm=String(d.getMonth()+1).padStart(2,"0");
  const dd=String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}
function xmur3(str){
  let h=1779033703 ^ str.length;
  for(let i=0;i<str.length;i++){ h=Math.imul(h ^ str.charCodeAt(i), 3432918353); h=(h<<13)|(h>>>19); }
  return function(){
    h=Math.imul(h ^ (h>>>16), 2246822507);
    h=Math.imul(h ^ (h>>>13), 3266489909);
    return (h ^= (h>>>16)) >>> 0;
  }
}
function mulberry32(a){
  return function(){
    let t=a+=0x6D2B79F5;
    t=Math.imul(t^(t>>>15), t|1);
    t^=t+Math.imul(t^(t>>>7), t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  }
}
function rngForToday(extra=""){
  const seedStr = dateKey()+"|"+extra;
  const seed = xmur3(seedStr)();
  return mulberry32(seed);
}

/* Keyboard */
const LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
function buildKeyboard(){
  keyboard.innerHTML="";
  for(const L of LETTERS){
    const b=document.createElement("button");
    b.className="btn small";
    b.textContent=L;
    b.dataset.letter=L;
    b.addEventListener("click", ()=>guess(L));
    keyboard.appendChild(b);
  }
}

/* Render helpers */
function setMessage(text, kind){
  msg.innerHTML=text;
  msg.classList.remove("status-ok","status-bad","status-warn");
  if(kind==="ok") msg.classList.add("status-ok");
  if(kind==="bad") msg.classList.add("status-bad");
  if(kind==="warn") msg.classList.add("status-warn");
}
function setResult(text, kind){
  resultMsg.innerHTML=text;
  resultMsg.classList.remove("status-ok","status-bad","status-warn");
  if(kind==="ok") resultMsg.classList.add("status-ok");
  if(kind==="bad") resultMsg.classList.add("status-bad");
  if(kind==="warn") resultMsg.classList.add("status-warn");
}
function renderWord(){
  if(!secret){ wordView.textContent="—"; return; }
  const out=[];
  for(let i=0;i<secret.length;i++) out.push(revealed[i] ? secret[i].toUpperCase() : "—");
  wordView.textContent = out.join(" ");
}
function hasLetter(n){
  for(const ch of secret) if(normChar(ch)===n) return true;
  return false;
}
function wrongLetters(){
  const arr=[];
  used.forEach(n=>{ if(!hasLetter(n)) arr.push(n); });
  arr.sort((a,b)=>a.localeCompare(b,"es"));
  return arr;
}
function renderWrong(){
  const w = wrongLetters();
  wrongView.textContent = w.length ? w.join(" ").toUpperCase() : "—";
}
function renderPills(){
  const modeLabel = mode==="solo" ? "1 jugador" : mode==="versus" ? "2 jugadores" : "Duelo";
  modePill.textContent = `Modo: ${modeLabel}`;
  triesPill.textContent = `Fallos: ${fails} / ${maxFails}`;
  const showCat = categoryHintChk.checked && (DIFF[diffSel.value].showCat || mode!=="solo");
  catPill.textContent = showCat ? `Categoría: ${category || "—"}` : "Categoría: (oculta)";
}
function renderScores(){
  scoreArea.style.display = (mode!=="solo") ? "grid" : "none";
  p1Pts.textContent=p[1].pts; p2Pts.textContent=p[2].pts;
  p1Hits.textContent=p[1].hits; p2Hits.textContent=p[2].hits;
  p1Fails.textContent=p[1].fails; p2Fails.textContent=p[2].fails;
  p1Streak.textContent=p[1].streak; p2Streak.textContent=p[2].streak;
  let turnLabel = "—";
  if(mode==="solo") turnLabel="Jugador";
  else if(mode==="versus") turnLabel=`Jugador ${turn}`;
  else if(mode==="duelo") turnLabel = duelPhase===1 ? "Jugador 1" : duelPhase===2 ? "Jugador 2" : "—";
  turnView.textContent = turnLabel;
  p1Turn.style.display=(mode!=="solo" && ((mode==="versus" && turn===1) || (mode==="duelo" && duelPhase===1)) && !ended) ? "inline-block" : "none";
  p2Turn.style.display=(mode!=="solo" && ((mode==="versus" && turn===2) || (mode==="duelo" && duelPhase===2)) && !ended) ? "inline-block" : "none";
}
function renderTimer(){
  const shown = timerArmed ? timeLeft : turnSeconds;
  timeLeftView.textContent = String(shown);
  const frac = Math.max(0, Math.min(1, shown/turnSeconds));
  timeBar.style.transform = `scaleX(${frac})`;

  timeBar.classList.remove("warn");
  if(timerArmed && timeLeft <= 5){
    timeBar.classList.add("warn");
  }
}
function renderHangman(){
  const parts = PARTS.length;
  const ratio = fails / maxFails;
  let visible = Math.floor(ratio * parts + 1e-9);
  if(fails >= maxFails) visible = parts;
  PARTS.forEach((el,i)=> el.style.opacity = (i < visible) ? "1" : "0");
}
function setKeyboardState(){
  keyboard.querySelectorAll("button").forEach(b=>{
    const n = normChar(b.dataset.letter);
    const was = used.has(n);
    b.disabled = ended || !secret || was;
    b.classList.remove("ok","bad");
    if(was) b.classList.add(hasLetter(n) ? "ok" : "bad");
  });
  hintBtn.disabled = ended || !secret || fails >= maxFails;
  revealBtn.disabled = ended || !secret;
  skipBtn.disabled = ended || !secret || mode!=="versus";
  wildBtn.disabled = ended || !secret || p[currentPlayer()].wildUsed || fails >= maxFails-1;
}
function renderAll(){
  stallSecView.textContent = String(stallSeconds);
  renderWord(); renderWrong(); renderPills(); renderScores(); renderTimer(); renderHangman(); setKeyboardState();
}

/* Timers */
function stopMainTimer(){ if(timer){ clearInterval(timer); timer=null; } }
function stopStallTimer(){ if(stallTimer){ clearInterval(stallTimer); stallTimer=null; } }
function armMainTimerIfNeeded(){
  if(timerArmed || ended || !secret) return;
  timerArmed = true;
  timeLeft = turnSeconds;
  renderTimer();
  stopMainTimer();
  timer = setInterval(()=>{
    if(ended){ stopMainTimer(); return; }
    timeLeft--;
    if(timeLeft <= 3 && timeLeft > 0) sfx_tick();
    if(timeLeft <= 0){ stopMainTimer(); onTimeout(); return; }
    renderTimer();
  }, 1000);
}
function startStallTimer(){
  stopStallTimer();
  if(ended || !secret) return;
  stallLeft = stallSeconds;
  stallTimer = setInterval(()=>{
    if(ended){ stopStallTimer(); return; }
    stallLeft--;
    if(stallLeft <= 0){ stopStallTimer(); onStall(); return; }
  }, 1000);
}
function resetStallTimer(){ startStallTimer(); }

/* Game helpers */
function currentPlayer(){
  if(mode==="solo") return 1;
  if(mode==="versus") return turn;
  if(mode==="duelo") return duelPhase===2 ? 2 : 1;
  return 1;
}
function pickItem(rng){
  const d = DIFF[diffSel.value];
  const pool = LIB.filter(x => x.w.length >= d.minLen && x.w.length <= d.maxLen);
  const R = rng || Math.random;
  return pool[Math.floor(R()*pool.length)];
}
function prepareWordForRound(item){
  secret = item.w;
  category = item.c;
  revealed = [];
  used = new Set();
  fails = 0;
  ended = false;
  timerArmed = false;
  stopMainTimer();
  turnSeconds = DIFF[diffSel.value].turnSeconds;
  stallSeconds = DIFF[diffSel.value].stallSeconds;

  for(let i=0;i<secret.length;i++){
    const ch = secret[i];
    const isLetter = /[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]/.test(ch);
    revealed[i] = !isLetter;
  }
  p[1].wildUsed=false; p[2].wildUsed=false;
  p[1].streak=0; p[2].streak=0;

  setResult("—","info");
  setMessage("Ronda lista. El tiempo empieza con la primera letra.", "info");
  metaMsg.innerHTML = `Anti-bloqueo: si no haces nada en <strong>${stallSeconds}</strong>s, cuenta como fallo.`;
  startStallTimer();
  renderAll();
}
function initRound(){
  const d = DIFF[diffSel.value];
  maxFails = d.maxFails;
  turnSeconds = d.turnSeconds;
  stallSeconds = d.stallSeconds;
  mode = modeSel.value;

  p = {
    1:{pts:0,hits:0,fails:0,streak:0,wildUsed:false},
    2:{pts:0,hits:0,fails:0,streak:0,wildUsed:false},
  };
  turn=1;
  duelPhase = (mode==="duelo") ? 1 : 0;
  duelSecret={1:"",2:""}; duelCategory={1:"",2:""};

  const rng = dailyChk.checked ? rngForToday(diffSel.value + "|" + mode) : null;

  if(mode==="duelo"){
    const it1 = pickItem(rng || Math.random);
    const it2 = pickItem(rng ? rngForToday(diffSel.value + "|" + mode + "|P2") : Math.random);
    duelSecret[1]=it1.w; duelCategory[1]=it1.c;
    duelSecret[2]=it2.w; duelCategory[2]=it2.c;
    prepareWordForRound({w:duelSecret[1], c:duelCategory[1]});
    setMessage("Duelo: juega Jugador 1. (Luego Jugador 2)", "info");
  } else {
    const it = pickItem(rng || Math.random);
    prepareWordForRound(it);
    if(mode==="versus") setMessage("2 jugadores: alternáis con la misma palabra.", "info");
  }
}

function onTimeout(){
  if(ended) return;
  fails++;
  p[currentPlayer()].fails++;
  p[currentPlayer()].streak = 0;
  sfx_bad();
  setMessage("⏱️ Tiempo agotado (fallo).", "warn");
  checkEndOrContinue(true);
}
function onStall(){
  if(ended) return;
  fails++;
  p[currentPlayer()].fails++;
  p[currentPlayer()].streak = 0;
  sfx_bad();
  setMessage("😴 Inactividad (fallo).", "warn");
  checkEndOrContinue(true);
}
function revealByNorm(n){
  let newly=0;
  for(let i=0;i<secret.length;i++) if(!revealed[i] && normChar(secret[i])===n){ revealed[i]=true; newly++; }
  return newly;
}
function lastFailFX(){
  flash.classList.add("on");
  svgBox.classList.add("shake");
  setTimeout(()=>flash.classList.remove("on"), 120);
  setTimeout(()=>svgBox.classList.remove("shake"), 500);
  sfx_last();
}
function checkEndOrContinue(switchOnAttempt){
  const won = (revealed.length > 0) && revealed.every(v=>v===true);
  const lost = fails >= maxFails;

  if(won){
    ended=true;
    stopMainTimer(); stopStallTimer();
    sfx_win();

    if(mode==="solo"){
      setResult(`🎉 Ganaste. Palabra: <strong>${secret.toUpperCase()}</strong>`, "ok");
    } else if(mode==="versus"){
      const a=p[1].pts, b=p[2].pts;
      const res = a>b ? "🏆 Gana Jugador 1" : b>a ? "🏆 Gana Jugador 2" : "🤝 Empate";
      setResult(`🎉 Palabra: <strong>${secret.toUpperCase()}</strong><br>${res} (J1 ${a} - J2 ${b})`, "ok");
    } else if(mode==="duelo"){
      if(duelPhase===1){
        duelPhase=2;
        prepareWordForRound({w:duelSecret[2], c:duelCategory[2]});
        setMessage("Duelo: turno Jugador 2.", "info");
        renderAll();
        return;
      } else {
        const a=p[1].pts, b=p[2].pts;
        const res = a>b ? "🏆 Gana Jugador 1" : b>a ? "🏆 Gana Jugador 2" : "🤝 Empate";
        setResult(`🎉 Duelo finalizado.<br>${res} (J1 ${a} - J2 ${b})`, "ok");
      }
    }
    renderAll();
    return;
  }

  if(lost){
    ended=true;
    stopMainTimer(); stopStallTimer();
    for(let i=0;i<revealed.length;i++) revealed[i]=true;
    sfx_lose();

    if(mode==="solo"){
      setResult(`💀 Perdiste. Palabra: <strong>${secret.toUpperCase()}</strong>`, "bad");
    } else if(mode==="versus"){
      const a=p[1].pts, b=p[2].pts;
      const res = a>b ? "🏆 Gana Jugador 1 (puntos)" : b>a ? "🏆 Gana Jugador 2 (puntos)" : "🤝 Empate";
      setResult(`💀 Palabra: <strong>${secret.toUpperCase()}</strong><br>${res} (J1 ${a} - J2 ${b})`, "bad");
    } else if(mode==="duelo"){
      if(duelPhase===1){
        duelPhase=2;
        prepareWordForRound({w:duelSecret[2], c:duelCategory[2]});
        setMessage("Duelo: Jugador 1 perdió su palabra. Turno Jugador 2.", "warn");
        renderAll();
        return;
      } else {
        const a=p[1].pts, b=p[2].pts;
        const res = a>b ? "🏆 Gana Jugador 1" : b>a ? "🏆 Gana Jugador 2" : "🤝 Empate";
        setResult(`💀 Duelo finalizado.<br>${res} (J1 ${a} - J2 ${b})`, "bad");
      }
    }
    renderAll();
    return;
  }

  stopMainTimer();
  timerArmed=false;
  resetStallTimer();
  if(mode==="versus" && switchOnAttempt) turn = (turn===1 ? 2 : 1);
  renderAll();
}

function awardStreakBonusIfNeeded(player){
  if(p[player].streak >= 2){
    p[player].pts += 1;
    setMessage(`🔥 Racha: <strong>${p[player].streak}</strong> (+1 punto extra)`, "ok");
  }
}

function guess(letter){
  if(ended || !secret) return;
  const player = currentPlayer();
  const n = normChar(letter);
  if(!n || used.has(n)) return;

  resetStallTimer();
  armMainTimerIfNeeded();

  used.add(n);
  const newly = revealByNorm(n);
  if(newly > 0){
    p[player].pts += newly;
    p[player].hits += 1;
    p[player].streak += 1;
    sfx_ok();
    setMessage(`✅ Acierto: <strong>${letter}</strong> (+${newly})`, "ok");
    awardStreakBonusIfNeeded(player);
  } else {
    if(fails === maxFails-1) lastFailFX();
    fails++;
    p[player].fails++;
    p[player].streak = 0;
    sfx_bad();
    setMessage(`❌ Fallo: <strong>${letter}</strong>`, "bad");
  }
  renderWrong();
  checkEndOrContinue(mode==="versus");
}

function hint(){
  if(ended || !secret || fails>=maxFails) return;
  const player = currentPlayer();
  resetStallTimer();
  armMainTimerIfNeeded();

  const candidates=[];
  for(let i=0;i<secret.length;i++){
    const isLetter = /[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]/.test(secret[i]);
    if(isLetter && !revealed[i]) candidates.push(i);
  }
  if(!candidates.length) return;

  const idx=candidates[Math.floor(Math.random()*candidates.length)];
  const ch=secret[idx];
  const n=normChar(ch);

  used.add(n);
  revealByNorm(n);

  if(fails === maxFails-1) lastFailFX();
  fails++;
  p[player].pts = Math.max(0, p[player].pts - 1);
  p[player].streak = 0;

  setMessage(`💡 Pista: <strong>${ch.toUpperCase()}</strong> (+1 fallo, -1 punto)`, "warn");
  renderWrong();
  checkEndOrContinue(mode==="versus");
}

function wildcard(){
  if(ended || !secret) return;
  const player = currentPlayer();
  if(p[player].wildUsed) return;

  resetStallTimer();
  armMainTimerIfNeeded();

  const consonants=[];
  for(let i=0;i<secret.length;i++){
    if(revealed[i]) continue;
    const c=secret[i];
    if(!/[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]/.test(c)) continue;
    const n=normChar(c);
    if("aeiou".includes(n)) continue;
    consonants.push(n);
  }
  if(!consonants.length){
    setMessage("Comodín: no hay consonantes ocultas.", "warn");
    return;
  }
  const n = consonants[Math.floor(Math.random()*consonants.length)];
  used.add(n);
  revealByNorm(n);

  p[player].wildUsed=true;
  p[player].pts = Math.max(0, p[player].pts - 2);
  p[player].streak = 0;

  if(fails >= maxFails-2) lastFailFX();
  fails += 2;
  p[player].fails += 2;

  setMessage(`🃏 Comodín: revelada consonante <strong>${n.toUpperCase()}</strong> (+2 fallos, -2 puntos)`, "warn");
  renderWrong();
  checkEndOrContinue(mode==="versus");
}

function giveUp(){
  if(ended || !secret) return;
  ended=true;
  stopMainTimer(); stopStallTimer();
  for(let i=0;i<revealed.length;i++) revealed[i]=true;
  setResult(`🏳️ Te rendiste. Palabra: <strong>${secret.toUpperCase()}</strong>`, "bad");
  setMessage("Pulsa “Nueva ronda”.", "info");
  renderAll();
}

function skipTurn(){
  if(ended || !secret || mode!=="versus") return;
  resetStallTimer();
  stopMainTimer(); timerArmed=false;
  turn = (turn===1 ? 2 : 1);
  setMessage("↪️ Pasas turno.", "info");
  renderAll();
}

/* Settings modal */
function openSettings(){ overlay.classList.add("on"); }
function closeSettings(){ overlay.classList.remove("on"); }
settingsBtn.addEventListener("click", openSettings);
closeSettingsBtn.addEventListener("click", closeSettings);
overlay.addEventListener("click", (e)=>{ if(e.target===overlay) closeSettings(); });
document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeSettings(); });

/* Events */
newBtn.addEventListener("click", initRound);
hintBtn.addEventListener("click", hint);
wildBtn.addEventListener("click", wildcard);
revealBtn.addEventListener("click", giveUp);
skipBtn.addEventListener("click", skipTurn);

audioBtn.addEventListener("click", ()=>{
  if(!unlockAudio()){ setMessage("⚠️ Audio no disponible.", "warn"); return; }
  audioBtn.textContent="⏸";
  startMusic();
  setMessage("🔊 Audio activado.", "info");
});
musicChk.addEventListener("change", ()=>{ if(audioUnlocked) startMusic(); });

document.addEventListener("keydown",(e)=>{
  if(ended || !secret) return;
  if(e.key===" " && mode==="versus"){ e.preventDefault(); skipTurn(); return; }
  const up=(e.key||"").toUpperCase();
  if(/^[A-ZÑ]$/.test(up)){ e.preventDefault(); guess(up); }
});

buildKeyboard();
renderAll();
