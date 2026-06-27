// =========================
// 搜索功能
// =========================
function doSearch(e){
e.preventDefault();

const keyword = encodeURIComponent(
document.getElementById("keyword").value
);

const engine = document.getElementById("engine").value;

let url = "";

if(engine === "google"){
url = "https://www.google.com/search?q=" + keyword;
}else{
url = "https://www.bing.com/search?q=" + keyword;
}

window.open(url,"_blank");
}

// =========================
// 时间 + 日期
// =========================
function updateTime(){
const now = new Date();

document.getElementById("time").innerText =
now.toLocaleTimeString("zh-CN",{hour12:false});

document.getElementById("date").innerText =
now.toLocaleDateString("zh-CN",{
year:"numeric",
month:"long",
day:"numeric",
weekday:"long"
});
}

setInterval(updateTime,1000);
updateTime();


// =========================
// welcome（🔥已修复卡住问题）
// =========================
function setWelcome(){

const hour = new Date().getHours();
let welcomeText = "";

if(hour < 6){
welcomeText = "🌙 夜深了，早点休息";
}else if(hour < 12){
welcomeText = "☀️ 早上好";
}else if(hour < 18){
welcomeText = "🌤️ 下午好";
}else{
welcomeText = "🌆 晚上好";
}

const el = document.getElementById("welcome");
if(el){
el.innerText = welcomeText;
}

}

setWelcome();


// =========================
// 天气
// =========================
fetch("https://wttr.in/?format=j1")
.then(res=>res.json())
.then(data=>{
const temp = data.current_condition[0].temp_C;
let desc = data.current_condition[0].weatherDesc[0].value;

const weatherMap = {
"Sunny":"晴天",
"Clear":"晴朗",
"Cloudy":"多云",
"Partly cloudy":"局部多云",
"Light rain":"小雨",
"Moderate rain":"中雨",
"Heavy rain":"大雨",
"Thunderstorm":"雷暴",
"Mist":"薄雾",
"Fog":"大雾",
"Snow":"下雪"
};

desc = weatherMap[desc] || desc;

let icon = "🌤️";
if(desc.includes("晴")) icon="☀️";
else if(desc.includes("云")) icon="☁️";
else if(desc.includes("雨")) icon="🌧️";
else if(desc.includes("雷")) icon="⛈️";
else if(desc.includes("雪")) icon="❄️";

document.getElementById("weather").innerText =
`${icon} ${temp}°C · ${desc}`;
})
.catch(()=>{
document.getElementById("weather").innerText =
"🌤️ 天气获取失败";
});


// =========================
// 一言
// =========================
fetch("https://v1.hitokoto.cn/")
.then(res=>res.json())
.then(data=>{
document.getElementById("hitokoto").innerHTML =
`「${data.hitokoto}」<br><small>—— ${data.from}</small>`;
})
.catch(()=>{
document.getElementById("hitokoto").innerText =
"保持热爱，奔赴山海。";
});


// =========================
// 主题切换
// =========================
function clearTheme(){
document.body.classList.remove(
"transparent-mode",
"dark-mode",
"light-mode"
);
}

function setTheme(mode){
clearTheme();

if(mode === "transparent"){
document.body.classList.add("transparent-mode");
}

if(mode === "dark"){
document.body.classList.add("dark-mode");
}

if(mode === "light"){
document.body.classList.add("light-mode");
}

localStorage.setItem("theme",mode);
}

// 自动加载主题
const savedTheme = localStorage.getItem("theme");
if(savedTheme){
setTheme(savedTheme);
}


// =========================
// 运行时间
// =========================
const startDate = new Date("2026-06-25");

function updateRuntime(){
const days = Math.floor((new Date() - startDate)/86400000);
const el = document.getElementById("runtime");
if(el){
el.innerText = `🚀 已运行 ${days} 天`;
}
}

updateRuntime();
setInterval(updateRuntime, 1000);


// =========================
// 折叠功能
// =========================
function bindFold(headerId, contentId, arrowId){

const header = document.getElementById(headerId);
const content = document.getElementById(contentId);
const arrow = document.getElementById(arrowId);

if(!header || !content) return;

header.onclick = () => {

content.classList.toggle("show");

if(arrow){
arrow.innerText = content.classList.contains("show") ? "▼" : "▶";
}

};
}

// 常用网站
bindFold("commonHeader","commonContent","commonArrow");

// 音乐区
bindFold("musicHeader","musicContent","musicArrow");


// =========================
// 粒子背景（安全初始化）
// =========================
if(typeof particlesJS !== "undefined"){
particlesJS("particles-js",{
particles:{
number:{value:60,density:{enable:true,value_area:800}},
color:{value:"#4fc3f7"},
shape:{type:"circle"},
opacity:{value:0.5},
size:{value:3,random:true},
line_linked:{
enable:true,
distance:150,
color:"#4fc3f7",
opacity:0.35,
width:1
},
move:{
enable:true,
speed:2,
direction:"none",
out_mode:"out"
}
},
interactivity:{
events:{
onhover:{enable:true,mode:"grab"},
onclick:{enable:true,mode:"push"}
},
modes:{
grab:{distance:180,opacity:0.8},
push:{particles_nb:4}
}
},
retina_detect:true
});
}
