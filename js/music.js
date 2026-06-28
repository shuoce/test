// ======================================================
// Music Player V2 - FINAL FIXED (CSS Adapted)
// ======================================================

// ======================
// DOM
// ======================

const musicPlayer = document.getElementById("musicPlayer");
const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const musicTitle = document.getElementById("musicTitle");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

const vinyl = document.getElementById("vinyl");
const foldBtn = document.getElementById("foldBtn");

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// ======================
// Audio Context
// ======================

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const smoothData = new Float32Array(bufferLength);

let sourceCreated = false;

// ======================
// Playlist
// ======================

const playlist = [
    {
        title: "奶酪",
        src: "Personalization/Music/Music/奶酪.mp3"
    }
];

let index = 0;

// ======================
// Canvas Resize（稳定版）
// ======================

function resizeCanvas(){

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

// ======================
// Audio Graph（只创建一次）
// ======================

function ensureAudioGraph(){

    if(sourceCreated) return;

    const source = audioCtx.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    sourceCreated = true;
}

// ======================
// Load Song
// ======================

function loadSong(i){

    audio.src = playlist[i].src;
    musicTitle.innerText = playlist[i].title;

    progress.value = 0;
    currentTime.innerText = "00:00";
    duration.innerText = "00:00";

    audio.load();
}

// ======================
// Play
// ======================

async function startPlay(){

    try{

        ensureAudioGraph();

        if(audioCtx.state === "suspended"){
            await audioCtx.resume();
        }

        await audio.play();

        playBtn.innerText = "⏸";
        vinyl.classList.add("playing");

    }catch(err){
        console.error(err);
    }
}

// ======================
// Format Time
// ======================

function format(t){

    t = Math.floor(t || 0);

    const m = Math.floor(t / 60);
    const s = t % 60;

    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// ======================
// Controls
// ======================

playBtn.onclick = async ()=>{

    if(audio.paused){
        await startPlay();
    }else{
        audio.pause();
    }
};

prevBtn.onclick = ()=>{

    index = (index - 1 + playlist.length) % playlist.length;
    loadSong(index);
    startPlay();
};

nextBtn.onclick = ()=>{

    index = (index + 1) % playlist.length;
    loadSong(index);
    startPlay();
};

// ======================
// Progress
// ======================

audio.ontimeupdate = ()=>{

    progress.value = audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;

    currentTime.innerText = format(audio.currentTime);
};

progress.oninput = ()=>{

    if(audio.duration){
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
};

audio.onloadedmetadata = ()=>{

    duration.innerText = format(audio.duration);
};

// ======================
// Volume
// ======================

volume.oninput = ()=>{

    audio.volume = Number(volume.value);
};

// ======================
// Events
// ======================

audio.onended = ()=> nextBtn.click();

audio.onplay = ()=>{

    playBtn.innerText = "⏸";
    vinyl.classList.add("playing");
};

audio.onpause = ()=>{

    playBtn.innerText = "▶";
    vinyl.classList.remove("playing");
};

// ======================
// Visualizer（CSS完全适配版）
// ======================

function draw(){

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const radius = rect.width * 0.28;

    ctx.shadowBlur = 10;
    ctx.shadowColor = "#4fc3f7";

    for(let i = 0; i < bufferLength; i++){

        smoothData[i] += (dataArray[i] - smoothData[i]) * 0.18;

        const value = smoothData[i] / 255;

        const angle = (i / bufferLength) * Math.PI * 2;

        const len = 8 + value * radius;

        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;

        const x2 = cx + Math.cos(angle) * (radius + len);
        const y2 = cy + Math.sin(angle) * (radius + len);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "#00e5ff");
        gradient.addColorStop(0.5, "#4fc3f7");
        gradient.addColorStop(1, "#ffffff");

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();
    }

    ctx.shadowBlur = 0;
}

draw();

// ======================
// Fold（核心修复）
// ======================

let folded = false;

foldBtn.onclick = ()=>{

    folded = !folded;

    musicPlayer.classList.toggle("folded", folded);

    // ⭐关键：防止按钮状态错乱
    foldBtn.innerText = folded ? "←" : "❌";

    // ⭐关键：折叠时停止动画（省性能）
    if(folded){
        vinyl.style.animationPlayState = "paused";
    }else{
        vinyl.style.animationPlayState = "running";
    }
};

// ======================
// Init
// ======================

loadSong(index);

audio.volume = 0.8;
volume.value = 0.8;
playBtn.innerText = "▶";

resizeCanvas();
