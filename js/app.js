// ===== 搜索 =====
function doSearch(e){
e.preventDefault();

const keyword = encodeURIComponent(document.getElementById("keyword").value);
const engine = document.getElementById("engine").value;

let url = engine === "google"
? "https://www.google.com/search?q=" + keyword
: "https://www.bing.com/search?q=" + keyword;

window.open(url,"_blank");
}

// ===== 时间 =====
function updateTime(){
const now = new Date();

document.getElementById("time").innerText =
now.toLocaleTimeString("zh-CN",{hour12:false});

document.getElementById("date").innerText =
now.toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"});
}
setInterval(updateTime,1000);
updateTime();

// ===== 天气 =====
fetch("https://wttr.in/?format=j1")
.then(r=>r.json())
.then(data=>{
const temp = data.current_condition[0].temp_C;
let desc = data.current_condition[0].weatherDesc[0].value;
document.getElementById("weather").innerText = `${temp}°C ${desc}`;
});

// ===== 一言 =====
fetch("https://v1.hitokoto.cn/")
.then(r=>r.json())
.then(data=>{
document.getElementById("hitokoto").innerHTML =
`「${data.hitokoto}」——${data.from}`;
});

// ===== theme =====
function clearTheme(){
document.body.classList.remove("transparent-mode","dark-mode","light-mode");
}

function setTheme(mode){
clearTheme();
if(mode==="transparent") document.body.classList.add("transparent-mode");
if(mode==="dark") document.body.classList.add("dark-mode");
if(mode==="light") document.body.classList.add("light-mode");
localStorage.setItem("theme",mode);
}

// ===== runtime =====
const startDate = new Date("2026-06-25");
setInterval(()=>{
const days = Math.floor((new Date()-startDate)/86400000);
document.getElementById("runtime").innerText = `已运行 ${days} 天`;
},1000);

// ===== 折叠 =====
function bindFold(h,c,a){
const header=document.getElementById(h);
const content=document.getElementById(c);
const arrow=document.getElementById(a);

header.onclick=()=>{
content.classList.toggle("show");
};
}

bindFold("commonHeader","commonContent");
bindFold("musicHeader","musicContent");

// ===== particles =====
particlesJS("particles-js",{
particles:{
number:{value:60},
color:{value:"#4fc3f7"},
shape:{type:"circle"},
opacity:{value:0.5},
size:{value:3},
line_linked:{enable:true,color:"#4fc3f7"},
move:{enable:true,speed:2}
}
});
