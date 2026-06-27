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

function resizeCanvas(){
    canvas.width = canvas.offsetWidth;
    canvas.height = 60;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const playlist = [
  { title: "奶酪", src: "Personalization/Music/Music/奶酪.mp3" }
];

let index = 0;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function loadSong(i){
    audio.src = playlist[i].src;
    musicTitle.innerText = playlist[i].title;
    audio.load();
}

function format(t){
    t = Math.floor(t || 0);
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

playBtn.onclick = async () => {
    if(audioCtx.state === "suspended"){
        await audioCtx.resume();
    }

    if(audio.paused){
        audio.play();
        playBtn.innerText = "⏸";
        vinyl.classList.add("playing");
    }else{
        audio.pause();
        playBtn.innerText = "▶";
        vinyl.classList.remove("playing");
    }
};

prevBtn.onclick = () => {
    index = (index - 1 + playlist.length) % playlist.length;
    loadSong(index);
    audio.play();
};

nextBtn.onclick = () => {
    index = (index + 1) % playlist.length;
    loadSong(index);
    audio.play();
};

audio.ontimeupdate = () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentTime.innerText = format(audio.currentTime);
};

progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

audio.onloadedmetadata = () => {
    duration.innerText = format(audio.duration);
};

volume.oninput = () => {
    audio.volume = volume.value;
};

audio.onended = () => nextBtn.click();

function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let barWidth = canvas.width / bufferLength;

    for(let i=0;i<bufferLength;i++){
        let barHeight = dataArray[i] / 2;
        ctx.fillStyle = "#4fc3f7";
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }
}
draw();

document.addEventListener("DOMContentLoaded", () => {
    let folded = false;

    foldBtn.addEventListener("click", () => {
        folded = !folded;
        musicPlayer.classList.toggle("folded", folded);
        foldBtn.innerText = folded ? "←" : "❌";
    });
});

loadSong(index);
audio.volume = 0.8;

