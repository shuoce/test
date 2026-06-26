const musicPlayer = document.getElementById("musicPlayer");
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicCover = document.getElementById("musicCover");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const musicTitle = document.getElementById("musicTitle");
const avatar = document.getElementById("avatar");

const playlist = [
{title:"奶酪",src:"Personalization/Music/Music/奶酪.mp3"}
];

let index = 0;

function loadSong(i){
audio.src = playlist[i].src;
musicTitle.innerText = playlist[i].title;
audio.load();
}

function format(t){
t=Math.floor(t||0);
return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");
}

playBtn.onclick=()=>{
if(audio.paused){
audio.play();
playBtn.innerText="⏸";
musicCover.classList.add("playing");
}else{
audio.pause();
playBtn.innerText="▶";
musicCover.classList.remove("playing");
}
};

prevBtn.onclick=()=>{
index=(index-1+playlist.length)%playlist.length;
loadSong(index);
audio.play();
};

nextBtn.onclick=()=>{
index=(index+1)%playlist.length;
loadSong(index);
audio.play();
};

audio.ontimeupdate=()=>{
progress.value=(audio.currentTime/audio.duration)*100||0;
currentTime.innerText=format(audio.currentTime);
};

progress.oninput=()=>{
audio.currentTime=(progress.value/100)*audio.duration;
};

audio.onloadedmetadata=()=>{
duration.innerText=format(audio.duration);
};

audio.onended=()=>{
nextBtn.click();
};

avatar.onclick=()=>{
musicPlayer.classList.toggle("hide");
};

loadSong(index);
audio.play().catch(()=>{});
