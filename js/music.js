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

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const smooth = new Float32Array(bufferLength);

let sourceCreated = false;
let folded = false;

const playlist = [
    {
        title: "奶酪",
        src: "Personalization/Music/Music/奶酪.mp3"
    }
];

let index = 0;

function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
}

function ensureAudio(){
    if(sourceCreated) return;
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    sourceCreated = true;
}

function load(i){
    audio.src = playlist[i].src;
    musicTitle.innerText = playlist[i].title;
}

async function play(){
    ensureAudio();
    if(audioCtx.state === "suspended") await audioCtx.resume();
    await audio.play();
    playBtn.innerText = "⏸";
    vinyl.classList.add("playing");
}

playBtn.onclick = ()=>{
    audio.paused ? play() : audio.pause();
};

prevBtn.onclick = ()=>{
    index = (index-1+playlist.length)%playlist.length;
    load(index);
    play();
};

nextBtn.onclick = ()=>{
    index = (index+1)%playlist.length;
    load(index);
    play();
};

audio.onplay = ()=>{
    vinyl.classList.add("playing");
};

audio.onpause = ()=>{
    vinyl.classList.remove("playing");
};

audio.onended = nextBtn.onclick;

volume.oninput = ()=>{
    audio.volume = volume.value;
};

foldBtn.onclick = ()=>{
    folded = !folded;
    musicPlayer.classList.toggle("folded", folded);
    foldBtn.innerText = folded ? "←" : "❌";
    resizeCanvas();
};

function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0,0,rect.width,rect.height);

    const cx = rect.width/2;
    const cy = rect.height/2;
    const r = rect.width*0.25;

    for(let i=0;i<bufferLength;i++){
        smooth[i]+= (dataArray[i]-smooth[i])*0.2;

        const angle = (i/bufferLength)*Math.PI*2;
        const len = smooth[i]/255 * r;

        const x1 = cx + Math.cos(angle)*r;
        const y1 = cy + Math.sin(angle)*r;

        const x2 = cx + Math.cos(angle)*(r+len);
        const y2 = cy + Math.sin(angle)*(r+len);

        ctx.beginPath();
        ctx.strokeStyle="#4fc3f7";
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
    }
}

load(index);
resizeCanvas();
draw();
