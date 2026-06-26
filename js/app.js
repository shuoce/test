fetch("components/music.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("musicBox").innerHTML = html;
    initMusic();
  });

function initMusic() {
  const btn = document.getElementById("foldBtn");
  const player = document.getElementById("musicPlayer");

  let folded = false;

  btn.onclick = () => {
    folded = !folded;

    if (folded) {
      player.style.height = "40px";
      btn.innerText = "←";
    } else {
      player.style.height = "auto";
      btn.innerText = "❌";
    }
  };
}
