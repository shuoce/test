const musicPlayer = document.getElementById("musicPlayer");
const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const musicCover = document.getElementById("musicCover");
const musicTitle = document.getElementById("musicTitle");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const foldBtn = document.getElementById("foldBtn"); // ❗关键补上

canvas.width = 320;
canvas.height = 60;

// =========================
// ⭐ 稳定版播放器折叠系统
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const musicPlayer = document.getElementById("musicPlayer");
    const foldBtn = document.getElementById("foldBtn");

    if (!musicPlayer || !foldBtn) {
        console.error("❌ 播放器或折叠按钮未找到");
        return;
    }

    // 防止旧事件冲突（关键）
    const newBtn = foldBtn.cloneNode(true);
    foldBtn.parentNode.replaceChild(newBtn, foldBtn);

    let folded = false;

    // 点击折叠/展开
    newBtn.addEventListener("click", () => {

        folded = !folded;

        musicPlayer.classList.toggle("folded", folded);

        newBtn.innerText = folded ? "←" : "❌";

        console.log("🎧 播放器折叠状态:", folded);
    });

});

// =====================
// 播放列表
// =====================
const playlist = [
  { title: "奶酪", src: "Personalization/Music/Music/奶酪.mp3" }
];

let index = 0;

// =====================
// Web Audio 可视化
// =====================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// =====================
// 加载歌曲
// =====================
function loadSong(i){
  audio.src = playlist[i].src;
  musicTitle.innerText = playlist[i].title;
  audio.load();
}

// =====================
// 时间格式
// =====================
function format(t){
  t = Math.floor(t || 0);
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// =====================
// 播放控制
// =====================
playBtn.onclick = () => {
  if(audio.paused){
    audioCtx.resume();
    audio.play();
    playBtn.innerText = "⏸";
  }else{
    audio.pause();
    playBtn.innerText = "▶";
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

// =====================
// 进度条
// =====================
audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTime.innerText = format(audio.currentTime);
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

// =====================
// 时长
// =====================
audio.onloadedmetadata = () => {
  duration.innerText = format(audio.duration);
};

// =====================
// 音量
// =====================
volume.oninput = () => {
  audio.volume = volume.value;
};

// =====================
// 自动下一首
// =====================
audio.onended = () => nextBtn.click();

// =====================
// 频谱动画
// =====================
function draw(){
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0,0,canvas.width,canvas.height);

  let barWidth = (canvas.width / bufferLength);

  for(let i=0;i<bufferLength;i++){
    let barHeight = dataArray[i] / 2;

    ctx.fillStyle = "#4fc3f7";
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
  }
}
draw();

// =====================
// 初始化
// =====================
loadSong(index);
audio.volume = 0.8;
