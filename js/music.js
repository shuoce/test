// ======================================================
// Music Player Ultimate v5
// Part 1 / 8
// ======================================================

// ======================
// DOM
// ======================

const musicPlayer = document.getElementById("musicPlayer");

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const randomBtn = document.getElementById("randomBtn");
const modeBtn = document.getElementById("modeBtnPlayer");

const listBtn = document.getElementById("listBtn");
const foldBtn = document.getElementById("foldBtn");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");

const vinyl = document.getElementById("vinyl");
const cover = document.getElementById("cover");

const lyric = document.getElementById("lyric");

const playlistPanel = document.getElementById("playlistPanel");
const playlistBox = document.getElementById("playlist");

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// ======================
// Canvas
// ======================

function resizeCanvas(){

    canvas.width = canvas.offsetWidth;

    canvas.height = 70;

}

window.addEventListener("resize",resizeCanvas);

resizeCanvas();


// ======================
// 播放列表
// ======================

const playlist=[

{

title:"奶酪",

artist:"未知歌手",

src:"Personalization/Music/Music/奶酪.mp3"

}

// 后面继续添加歌曲
// {
// title:"第二首",
// artist:"未知歌手",
// src:"Personalization/Music/Music/第二首.mp3"
// }

];


// ======================
// 状态
// ======================

let currentIndex=0;

let isRandom=false;

let playMode="list";

let folded=false;


// ======================
// AudioContext
// ======================

const AudioContextClass=
window.AudioContext||
window.webkitAudioContext;

const audioCtx=
new AudioContextClass();

const source=
audioCtx.createMediaElementSource(audio);

const analyser=
audioCtx.createAnalyser();

source.connect(analyser);

analyser.connect(audioCtx.destination);

analyser.fftSize=128;

const bufferLength=
analyser.frequencyBinCount;

const dataArray=
new Uint8Array(bufferLength);


// ======================
// 时间格式
// ======================

function formatTime(sec){

sec=Math.floor(sec||0);

const m=Math.floor(sec/60);

const s=sec%60;

return String(m).padStart(2,"0")+
":"+
String(s).padStart(2,"0");

}

// ======================================================
// Part 2 / 8
// 播放核心
// ======================================================


// ======================
// 加载歌曲
// ======================

function loadSong(index){

    const song=playlist[index];

    audio.src=song.src;

    musicTitle.innerText=song.title;

    musicArtist.innerText=song.artist;

    cover.src="Personalization/avatar.png";

    lyric.innerHTML="♪ 暂无歌词 ♪";

    audio.load();

    updatePlaylist();

}


// ======================
// 播放
// ======================

async function playMusic(){

    if(audioCtx.state==="suspended"){

        await audioCtx.resume();

    }

    await audio.play();

    playBtn.innerText="⏸";

    vinyl.classList.add("playing");

}


// ======================
// 暂停
// ======================

function pauseMusic(){

    audio.pause();

    playBtn.innerText="▶";

    vinyl.classList.remove("playing");

}


// ======================
// 播放按钮
// ======================

playBtn.onclick=()=>{

    if(audio.paused){

        playMusic();

    }else{

        pauseMusic();

    }

};


// ======================
// 上一首
// ======================

prevBtn.onclick=()=>{

    if(isRandom){

        currentIndex=Math.floor(

            Math.random()*playlist.length

        );

    }else{

        currentIndex--;

        if(currentIndex<0){

            currentIndex=playlist.length-1;

        }

    }

    loadSong(currentIndex);

    playMusic();

};


// ======================
// 下一首
// ======================

nextBtn.onclick=()=>{

    if(isRandom){

        currentIndex=Math.floor(

            Math.random()*playlist.length

        );

    }else{

        currentIndex++;

        if(currentIndex>=playlist.length){

            currentIndex=0;

        }

    }

    loadSong(currentIndex);

    playMusic();

};


// ======================
// 自动播放下一首
// ======================

audio.onended=()=>{

    if(playMode==="one"){

        audio.currentTime=0;

        playMusic();

        return;

    }

    nextBtn.click();

};


// ======================
// 初始化
// ======================

loadSong(currentIndex);

audio.volume=0.8;

volume.value=0.8;

// ======================================================
// Part 3 / 8
// 进度条 + 时间 + 音量
// ======================================================


// ======================
// 加载完成
// ======================

audio.onloadedmetadata=()=>{

    duration.innerText=formatTime(audio.duration);

};


// ======================
// 更新时间
// ======================

audio.ontimeupdate=()=>{

    if(!audio.duration)return;

    progress.value=

    audio.currentTime/

    audio.duration

    *100;

    currentTime.innerText=

    formatTime(audio.currentTime);

};


// ======================
// 拖动进度
// ======================

progress.oninput=()=>{

    if(!audio.duration)return;

    audio.currentTime=

    progress.value/100*

    audio.duration;

};


// ======================
// 音量
// ======================

volume.oninput=()=>{

    audio.volume=volume.value;

    localStorage.setItem(

        "musicVolume",

        volume.value

    );

};


// ======================
// 恢复音量
// ======================

const saveVolume=

localStorage.getItem(

"musicVolume"

);

if(saveVolume!==null){

    audio.volume=saveVolume;

    volume.value=saveVolume;

}else{

    audio.volume=0.8;

    volume.value=0.8;

}


// ======================
// 双击黑胶
// 播放/暂停
// ======================

vinyl.ondblclick=()=>{

    playBtn.click();

};


// ======================
// 空格控制播放
// ======================

document.addEventListener(

"keydown",

e=>{

    if(

        e.code==="Space"

    ){

        e.preventDefault();

        playBtn.click();

    }

}

);

// ======================================================
// Part 4 / 8
// 播放列表
// ======================================================


// ======================
// 渲染播放列表
// ======================

function updatePlaylist(){

    playlistBox.innerHTML="";

    playlist.forEach((song,index)=>{

        const item=document.createElement("div");

        item.className="playlist-item";

        if(index===currentIndex){

            item.classList.add("active");

        }

        item.innerHTML=`
            <div>${song.title}</div>
            <small>${song.artist}</small>
        `;

        item.onclick=()=>{

            currentIndex=index;

            loadSong(currentIndex);

            playMusic();

        };

        playlistBox.appendChild(item);

    });

}


// ======================
// 展开 / 收起播放列表
// ======================

listBtn.onclick=()=>{

    playlistPanel.classList.toggle("show");

};


// ======================
// 默认生成列表
// ======================

updatePlaylist();

