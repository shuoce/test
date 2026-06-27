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

// ======================================================
// Part 5 / 8
// 随机 + 循环 + 折叠
// ======================================================


// ======================
// 随机播放
// ======================

randomBtn.onclick=()=>{

    isRandom=!isRandom;

    randomBtn.classList.toggle("active",isRandom);

};


// ======================
// 播放模式
// list → one → list
// ======================

modeBtn.onclick=()=>{

    if(playMode==="list"){

        playMode="one";

        modeBtn.innerText="🔂";

    }else{

        playMode="list";

        modeBtn.innerText="🔁";

    }

};


// ======================
// 折叠播放器
// ======================

foldBtn.onclick=()=>{

    folded=!folded;

    musicPlayer.classList.toggle(

        "folded",

        folded

    );

    foldBtn.innerText=

    folded?"←":"❌";

};


// ======================
// 双击播放器展开
// ======================

musicPlayer.ondblclick=()=>{

    if(!folded)return;

    folded=false;

    musicPlayer.classList.remove(

        "folded"

    );

    foldBtn.innerText="❌";

};


// ======================
// ESC展开
// ======================

document.addEventListener(

"keydown",

e=>{

    if(

        e.key==="Escape"

    ){

        folded=false;

        musicPlayer.classList.remove(

            "folded"

        );

        foldBtn.innerText="❌";

    }

});

// ======================================================
// Part 6 / 8
// Apple Music 频谱
// ======================================================


// ======================
// 频谱动画
// ======================

function drawVisualizer(){

    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    const barCount=bufferLength;

    const barWidth=

    canvas.width/barCount;

    for(

        let i=0;

        i<barCount;

        i++

    ){

        const value=

        dataArray[i];

        const h=

        value/255*

        canvas.height;

        const x=

        i*barWidth;

        const y=

        canvas.height-h;

        const color=

        ctx.createLinearGradient(

            0,

            y,

            0,

            canvas.height

        );

        color.addColorStop(

            0,

            "#00E5FF"

        );

        color.addColorStop(

            0.5,

            "#4FC3F7"

        );

        color.addColorStop(

            1,

            "#1565C0"

        );

        ctx.fillStyle=color;

        ctx.beginPath();

        ctx.roundRect(

            x,

            y,

            barWidth-2,

            h,

            3

        );

        ctx.fill();

    }

}

drawVisualizer();


// ======================
// 播放时发光
// ======================

audio.addEventListener(

"play",

()=>{

    vinyl.style.boxShadow=

    "0 0 35px rgba(79,195,247,.7)";

}

);


// ======================
// 暂停取消发光
// ======================

audio.addEventListener(

"pause",

()=>{

    vinyl.style.boxShadow=

    "0 0 0 rgba(0,0,0,0)";

}

);


// ======================
// 鼠标悬停缩放
// ======================

vinyl.onmouseenter=()=>{

    vinyl.style.transform=

    "scale(1.06)";

};

vinyl.onmouseleave=()=>{

    vinyl.style.transform=

    "scale(1)";

};


// ======================
// 页面隐藏暂停动画
// ======================

document.addEventListener(

"visibilitychange",

()=>{

    if(document.hidden){

        vinyl.style.animationPlayState=

        "paused";

    }else{

        vinyl.style.animationPlayState=

        "running";

    }

});

// ======================================================
// Part 7 / 8
// 本地记忆（LocalStorage）
// ======================================================


// ======================
// 保存播放器状态
// ======================

function savePlayerState(){

    localStorage.setItem(
        "music_index",
        currentIndex
    );

    localStorage.setItem(
        "music_time",
        audio.currentTime
    );

    localStorage.setItem(
        "music_random",
        isRandom
    );

    localStorage.setItem(
        "music_mode",
        playMode
    );

    localStorage.setItem(
        "music_folded",
        folded
    );

}


// ======================
// 每5秒自动保存
// ======================

setInterval(

savePlayerState,

5000

);


// ======================
// 切歌保存
// ======================

audio.addEventListener(

"loadedmetadata",

()=>{

    savePlayerState();

}

);


// ======================
// 恢复歌曲
// ======================

const saveIndex=

parseInt(

localStorage.getItem(

"music_index"

)

);

if(

!isNaN(saveIndex)&&

saveIndex<playlist.length

){

    currentIndex=saveIndex;

    loadSong(currentIndex);

}


// ======================
// 恢复播放位置
// ======================

audio.addEventListener(

"loadedmetadata",

()=>{

    const t=

    parseFloat(

        localStorage.getItem(

        "music_time"

        )

    );

    if(!isNaN(t)){

        audio.currentTime=t;

    }

});


// ======================
// 恢复随机播放
// ======================

const saveRandom=

localStorage.getItem(

"music_random"

);

if(saveRandom==="true"){

    isRandom=true;

    randomBtn.classList.add(

        "active"

    );

}


// ======================
// 恢复播放模式
// ======================

const saveMode=

localStorage.getItem(

"music_mode"

);

if(saveMode){

    playMode=saveMode;

}

if(playMode==="one"){

    modeBtn.innerText="🔂";

}else{

    modeBtn.innerText="🔁";

}


// ======================
// 恢复折叠
// ======================

const saveFold=

localStorage.getItem(

"music_folded"

);

if(saveFold==="true"){

    folded=true;

    musicPlayer.classList.add(

        "folded"

    );

    foldBtn.innerText="←";

}


// ======================
// 页面关闭保存
// ======================

window.addEventListener(

"beforeunload",

()=>{

    savePlayerState();

});

// ======================================================
// Part 8 / 8
// Ultimate Finish
// ======================================================


// ======================
// 音量淡入
// ======================

function fadeIn(){

    audio.volume=0;

    const target=

    parseFloat(volume.value);

    const timer=

    setInterval(()=>{

        if(audio.volume>=target){

            clearInterval(timer);

            audio.volume=target;

            return;

        }

        audio.volume+=0.02;

    },30);

}


// ======================
// 音量淡出
// ======================

function fadeOut(callback){

    const timer=

    setInterval(()=>{

        if(audio.volume<=0.02){

            clearInterval(timer);

            audio.pause();

            audio.volume=

            parseFloat(volume.value);

            if(callback){

                callback();

            }

            return;

        }

        audio.volume-=0.02;

    },30);

}


// ======================
// 双击进度条回到开始
// ======================

progress.ondblclick=()=>{

    audio.currentTime=0;

};


// ======================
// 双击时间切换
// ======================

let showRemain=false;

document.querySelector(

".music-time"

).ondblclick=()=>{

    showRemain=!showRemain;

};


audio.addEventListener(

"timeupdate",

()=>{

    if(

        !audio.duration

    )return;

    if(showRemain){

        currentTime.innerText=

        "-"+

        formatTime(

            audio.duration-

            audio.currentTime

        );

    }

});


// ======================
// Ctrl + ←
// 上一首
// ======================

document.addEventListener(

"keydown",

e=>{

    if(

        e.ctrlKey&&

        e.key==="ArrowLeft"

    ){

        prevBtn.click();

    }

});


// ======================
// Ctrl + →
// 下一首
// ======================

document.addEventListener(

"keydown",

e=>{

    if(

        e.ctrlKey&&

        e.key==="ArrowRight"

    ){

        nextBtn.click();

    }

});


// ======================
// Ctrl + ↑
// 音量增加
// ======================

document.addEventListener(

"keydown",

e=>{

    if(

        e.ctrlKey&&

        e.key==="ArrowUp"

    ){

        audio.volume=

        Math.min(

            1,

            audio.volume+0.05

        );

        volume.value=

        audio.volume;

    }

});


// ======================
// Ctrl + ↓
// 音量降低
// ======================

document.addEventListener(

"keydown",

e=>{

    if(

        e.ctrlKey&&

        e.key==="ArrowDown"

    ){

        audio.volume=

        Math.max(

            0,

            audio.volume-0.05

        );

        volume.value=

        audio.volume;

    }

});


// ======================
// 初始化
// ======================

loadSong(currentIndex);

updatePlaylist();

resizeCanvas();

drawVisualizer();


// ======================
// 控制台
// ======================

console.log(

"%c🎵 Music Player Ultimate Pro Max 已启动",

"color:#4FC3F7;font-size:16px;font-weight:bold;"

);
