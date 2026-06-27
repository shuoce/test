// ======================================================
// Music Player V2
// Part 1
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
// Canvas
// ======================

function resizeCanvas(){

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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
// Audio API
// ======================

const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext();

const source = audioCtx.createMediaElementSource(audio);

const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;

const dataArray = new Uint8Array(bufferLength);

// ======================
// Load Song
// ======================

function loadSong(i){

    audio.src = playlist[i].src;

    musicTitle.innerText = playlist[i].title;

    audio.load();

}

// ======================
// Start Play
// ======================

async function startPlay(){

    if(audioCtx.state === "suspended"){
        await audioCtx.resume();
    }

    await audio.play();

    playBtn.innerText = "⏸";

    vinyl.classList.add("playing");

}

// ======================
// Time
// ======================

function format(t){

    t = Math.floor(t || 0);

    const m = Math.floor(t / 60);

    const s = t % 60;

    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

// ======================
// Buttons
// ======================

playBtn.onclick = async ()=>{

    if(audio.paused){

        await startPlay();

    }else{

        audio.pause();

        playBtn.innerText = "▶";

        vinyl.classList.remove("playing");

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

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    }

};

audio.onloadedmetadata = ()=>{

    duration.innerText = format(audio.duration);

};

// ======================
// Volume
// ======================

volume.oninput = () => {

    audio.volume = Number(volume.value);

};

// ======================
// Events
// ======================

audio.onended = () => {

    nextBtn.click();

};

audio.onplay = () => {

    playBtn.innerText = "⏸";

    vinyl.classList.add("playing");

};

audio.onpause = () => {

    playBtn.innerText = "▶";

    vinyl.classList.remove("playing");

};

// ======================
// Visualizer（圆形频谱）
// ======================

function draw(){

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const radius = canvas.width * 0.28;

    const count = bufferLength;

    for(let i = 0; i < count; i++){

        const value = dataArray[i] / 255;

        const angle = (Math.PI * 2 / count) * i;

        const len = value * (canvas.width * 0.12);

        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;

        const x2 = cx + Math.cos(angle) * (radius + len);
        const y2 = cy + Math.sin(angle) * (radius + len);

        ctx.beginPath();
        ctx.strokeStyle = "#4fc3f7";
        ctx.lineWidth = 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

draw();

// ======================
// Fold
// ======================

let folded = false;

foldBtn.addEventListener("click", () => {

    folded = !folded;

    musicPlayer.classList.toggle("folded", folded);

    foldBtn.innerText = folded ? "←" : "❌";

});

// ======================
// Init
// ======================

loadSong(index);

audio.volume = 0.8;

volume.value = 0.8;

playBtn.innerText = "▶";
