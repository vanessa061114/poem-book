const poemLines = [
  "春风又绿江南岸",
  "明月何时照我还",
  "人生若只如初见",
  "夜来风雨声，花落知多少",
  "此情可待成追忆，只是当时已惘然"
];

function addPoemLine() {
  const container = document.getElementById("poem-container");
  const line = document.createElement("div");
  line.className = "poem-line";
  line.textContent = poemLines[Math.floor(Math.random() * poemLines.length)];
  container.appendChild(line);
}

function changeTheme() {
  const theme = document.getElementById("theme-selector").value;
  document.body.className = `theme-${theme}`;
}
