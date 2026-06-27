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

// =========================
// 加载歌曲
// =========================
function loadSong(i){
audio.src = playlist[i].src;
musicTitle.innerText = playlist[i].title;
audio.load();
}

// =========================
// 时间格式化
// =========================
function format(t){
t = Math.floor(t || 0);
const m = Math.floor(t / 60);
const s = t % 60;
return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// =========================
// 播放 / 暂停
// =========================
playBtn.onclick = () => {
if(audio.paused){
audio.play();
playBtn.innerText = "⏸";
musicCover.classList.add("playing");
}else{
audio.pause();
playBtn.innerText = "▶";
musicCover.classList.remove("playing");
}
};

// =========================
// 上一首
// =========================
prevBtn.onclick = () => {
index = (index - 1 + playlist.length) % playlist.length;
loadSong(index);
audio.play();
playBtn.innerText = "⏸";
musicCover.classList.add("playing");
};

// =========================
// 下一首
// =========================
nextBtn.onclick = () => {
index = (index + 1) % playlist.length;
loadSong(index);
audio.play();
playBtn.innerText = "⏸";
musicCover.classList.add("playing");
};

// =========================
// 进度条更新
// =========================
audio.ontimeupdate = () => {
progress.value = (audio.currentTime / audio.duration) * 100 || 0;
currentTime.innerText = format(audio.currentTime);
};

// =========================
// 拖动进度条
// =========================
progress.oninput = () => {
audio.currentTime = (progress.value / 100) * audio.duration;
};

// =========================
// 加载时长
// =========================
audio.onloadedmetadata = () => {
duration.innerText = format(audio.duration);
};

// =========================
// 自动下一首
// =========================
audio.onended = () => {
nextBtn.click();
};

// =========================
// 封面旋转状态
// =========================
audio.addEventListener("play", () => {
musicCover.classList.add("playing");
});

audio.addEventListener("pause", () => {
musicCover.classList.remove("playing");
});

// =========================
// 头像控制播放器显示/隐藏
// =========================
avatar.onclick = () => {
musicPlayer.classList.toggle("hide");
};

// =========================
// 折叠按钮（展开/收起播放器）
// =========================
foldBtn.onclick = () => {
musicPlayer.classList.toggle("folded");

if(musicPlayer.classList.contains("folded")){
foldBtn.innerText = "←";
}else{
foldBtn.innerText = "❌";
}
};

// =========================
// 初始化
// =========================
loadSong(index);

// 自动尝试播放（浏览器可能阻止）
audio.play().then(() => {
playBtn.innerText = "⏸";
musicCover.classList.add("playing");
}).catch(() => {
console.log("自动播放被浏览器阻止，需要用户点击");
});
