// =========================
// 元素获取
// =========================
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

const avatar = document.getElementById("avatar");
const foldBtn = document.getElementById("foldBtn");

// =========================
// 播放列表
// =========================
const playlist = [
  {
    title: "奶酪",
    src: "Personalization/Music/Music/奶酪.mp3"
  }
];

let index = 0;
let isFolded = false;

// =========================
// 加载歌曲
// =========================
function loadSong(i){
  const song = playlist[i];

  audio.src = song.src;
  musicTitle.innerText = song.title;

  audio.load();
}

// =========================
// 时间格式化
// =========================
function format(t){
  if(!t || isNaN(t)) return "00:00";

  t = Math.floor(t);
  const m = Math.floor(t / 60);
  const s = t % 60;

  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// =========================
// 播放状态统一控制
// =========================
function setPlayingUI(isPlaying){
  playBtn.innerText = isPlaying ? "⏸" : "▶";

  if(isPlaying){
    musicCover.classList.add("playing");
  }else{
    musicCover.classList.remove("playing");
  }
}

// =========================
// 播放 / 暂停
// =========================
playBtn.onclick = async () => {
  if(audio.paused){
    try{
      await audio.play();
      setPlayingUI(true);
    }catch(e){
      console.log("播放失败:", e);
    }
  }else{
    audio.pause();
    setPlayingUI(false);
  }
};

// =========================
// 上一首 / 下一首
// =========================
function changeSong(step){
  index = (index + step + playlist.length) % playlist.length;
  loadSong(index);

  audio.play().then(()=>{
    setPlayingUI(true);
  });
}

prevBtn.onclick = () => changeSong(-1);
nextBtn.onclick = () => changeSong(1);

// =========================
// 进度条
// =========================
audio.ontimeupdate = () => {
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
  }

  currentTime.innerText = format(audio.currentTime);
};

// =========================
// 拖动进度条
// =========================
progress.oninput = () => {
  if(audio.duration){
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
};

// =========================
// 时长
// =========================
audio.onloadedmetadata = () => {
  duration.innerText = format(audio.duration);
};

// =========================
// 自动下一首
// =========================
audio.onended = () => {
  changeSong(1);
};

// =========================
// 音频状态同步（防UI错乱）
// =========================
audio.addEventListener("play", () => setPlayingUI(true));
audio.addEventListener("pause", () => setPlayingUI(false));

// =========================
// 头像：显示 / 隐藏播放器（带状态修复）
// =========================
avatar.onclick = () => {
  musicPlayer.classList.toggle("hide");
};

// =========================
// 折叠 / 展开（强制同步DOM状态）
// =========================
foldBtn.onclick = () => {

  isFolded = !isFolded;

  musicPlayer.classList.toggle("folded", isFolded);

  foldBtn.innerText = isFolded ? "←" : "❌";
  foldBtn.title = isFolded ? "展开播放器" : "折叠播放器";
};

// =========================
// 初始化
// =========================
loadSong(index);

// 尝试自动播放
audio.play()
.then(()=> setPlayingUI(true))
.catch(()=> console.log("浏览器阻止自动播放"));
