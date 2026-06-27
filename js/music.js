// =========================
// 元素获取（主播放器）
// =========================
const musicPlayer = document.getElementById("musicPlayer");
const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const musicTitle = document.getElementById("musicTitle");
const musicTitle2 = document.getElementById("musicTitle2");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

const vinyl = document.getElementById("vinyl");
const vinyl2 = document.getElementById("vinyl2");

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// =========================
// 沉浸模式
// =========================
const immersive = document.getElementById("immersive");
const exitImmersive = document.getElementById("exitImmersive");

// 双击进入沉浸模式
musicPlayer.addEventListener("dblclick", () => {
    immersive.classList.add("active");
});

// 退出沉浸模式
exitImmersive.onclick = () => {
    immersive.classList.remove("active");
};

// =========================
// 播放列表
// =========================
const playlist = [
    { title: "奶酪", src: "Personalization/Music/Music/奶酪.mp3" }
];

let index = 0;

// =========================
// Web Audio（频谱）
// =========================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// =========================
// 加载歌曲
// =========================
function loadSong(i){
    audio.src = playlist[i].src;
    musicTitle.innerText = playlist[i].title;
    if(musicTitle2) musicTitle2.innerText = playlist[i].title;
    audio.load();
}

// =========================
// 时间格式
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
        audioCtx.resume();
        audio.play();
        playBtn.innerText = "⏸";
    }else{
        audio.pause();
        playBtn.innerText = "▶";
    }
};

// =========================
// 上一首 / 下一首
// =========================
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

// =========================
// 进度条
// =========================
audio.ontimeupdate = () => {

    progress.value = (audio.currentTime / audio.duration) * 100 || 0;

    currentTime.innerText = format(audio.currentTime);

    // 歌词同步
    updateLyrics(audio.currentTime);
};

// =========================
// 拖动进度条
// =========================
progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

// =========================
// 时长
// =========================
audio.onloadedmetadata = () => {
    duration.innerText = format(audio.duration);
};

// =========================
// 音量
// =========================
volume.oninput = () => {
    audio.volume = volume.value;
};

// =========================
// 黑胶动画联动
// =========================
audio.addEventListener("play", () => {
    vinyl.classList.add("playing");
    vinyl2?.classList.add("playing");
});

audio.addEventListener("pause", () => {
    vinyl.classList.remove("playing");
    vinyl2?.classList.remove("playing");
});

// =========================
// 播放结束
// =========================
audio.onended = () => nextBtn.click();

// =========================
// 歌词系统（v5）
// =========================
const lyricsData = [
    { time: 0, text: "音乐开始..." },
    { time: 5, text: "风吹过耳边" },
    { time: 10, text: "像回忆一样轻" },
    { time: 15, text: "我们曾经靠近" },
    { time: 20, text: "又慢慢远离" }
];

const lyricsBox = document.getElementById("lyricsBox");
const lyricsBox2 = document.getElementById("lyricsBox2");

// 渲染歌词
function renderLyrics(){
    if(lyricsBox){
        lyricsBox.innerHTML = "";
        lyricsData.forEach(l => {
            const div = document.createElement("div");
            div.className = "lyrics-line";
            div.innerText = l.text;
            lyricsBox.appendChild(div);
        });
    }

    if(lyricsBox2){
        lyricsBox2.innerHTML = lyricsBox.innerHTML;
    }
}
renderLyrics();

// 更新歌词
function updateLyrics(currentTime){

    const lines = document.querySelectorAll(".lyrics-line");

    lyricsData.forEach((l, i) => {

        if(currentTime >= l.time){

            lines.forEach(el => el.classList.remove("active"));

            if(lines[i]){
                lines[i].classList.add("active");
                lines[i].scrollIntoView({
                    behavior:"smooth",
                    block:"center"
                });
            }
        }
    });
}

// =========================
// 频谱动画
// =========================
function draw(){

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let barWidth = canvas.width / bufferLength;

    for(let i=0;i<bufferLength;i++){

        let barHeight = dataArray[i];

        ctx.fillStyle = "#4fc3f7";

        ctx.fillRect(
            i * barWidth,
            canvas.height - barHeight/2,
            barWidth - 2,
            barHeight
        );
    }
}
draw();

// =========================
// 初始化
// =========================
loadSong(index);
audio.volume = 0.8;

// 自动播放（可能被浏览器阻止）
audio.play().catch(()=>{});
