let boatContainer = document.getElementById("boatContainer");
let food = document.getElementById("food");
let shark = document.getElementById("shark");
let score = document.getElementById("score");

let finalMessage = document.getElementById("finalMessage");
let levelMsg = document.getElementById("levelMsg");
let refreshBtn = document.getElementById("refreshBtn");
let crowsDiv = document.getElementById("crows");

let level1Btn = document.getElementById("level1Btn");
let level2Btn = document.getElementById("level2Btn");
let levelSelect = document.getElementById("level-select");

let pos = 0;
let interval = null;
let sharkInterval = null;

/* ───────────── LEVEL SELECTION ───────────── */
level1Btn.addEventListener("click", () => {
    levelSelect.style.display = "none";
    startLevel1();
});

level2Btn.addEventListener("click", () => {
    levelSelect.style.display = "none";
    startLevel2();
});

refreshBtn.addEventListener("click", () => location.reload());

/* ───────────── LEVEL-1 ───────────── */
function startLevel1() {
    resetObjects();
    levelMsg.innerText = "🚤 Level 1 — Eat the food!";
    interval = setInterval(moveBoatLevel1, 20);
}

function moveBoatLevel1() {
    pos += 3;
    boatContainer.style.left = pos + "px";

    if (isColliding(boatContainer, food)) finishLevel1();
}

function finishLevel1() {
    clearInterval(interval);
    food.style.display = "none";
    score.innerText = Number(score.innerText) + 1;

    finalMessage.style.display = "block";
    finalMessage.innerText = "🎉 PANHAGGA! Level 1 Completed!";
    levelMsg.innerText = "";

    crowsDiv.style.display = "block";
    crowsDiv.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        let img = document.createElement("img");
        img.src = "assets/crow.png";
        img.classList.add("crow-img");
        crowsDiv.appendChild(img);
    }

    refreshBtn.style.display = "inline-block";
}

/* ───────────── LEVEL-2 ───────────── */
function startLevel2() {
    resetObjects();
    levelMsg.innerText = "⚔ Level 2 — Avoid the Shark!";
    shark.style.display = "block";
    interval = setInterval(moveBoatLevel2, 20);
    sharkInterval = setInterval(moveShark, 30);
}

function moveBoatLevel2() {
    pos += 3.8;
    boatContainer.style.left = pos + "px";

    if (isColliding(boatContainer, shark)) gameOver();
    if (isColliding(boatContainer, food)) winLevel2();
}

let sharkDir = 1;
function moveShark() {
    let x = shark.offsetLeft;
    if (x >= 600) sharkDir = -1;
    if (x <= 150) sharkDir = 1;
    shark.style.left = x + (5 * sharkDir) + "px";
}

/* ───────────── RESULTS ───────────── */
function gameOver() {
    clearInterval(interval);
    clearInterval(sharkInterval);
    finalMessage.style.display = "block";
    finalMessage.innerText = "💀 GAME OVER — Shark got you!";
    levelMsg.innerText = "";
    refreshBtn.style.display = "inline-block";
}

function winLevel2() {
    clearInterval(interval);
    clearInterval(sharkInterval);
    score.innerText = Number(score.innerText) + 1;

    finalMessage.style.display = "block";
    finalMessage.innerText = "🏆 YOU BEAT LEVEL 2!";
    levelMsg.innerText = "";
    refreshBtn.style.display = "inline-block";
}

/* ───────────── UTILITIES ───────────── */
function resetObjects() {
    pos = 0;
    boatContainer.style.left = "0px";

    food.style.display = "block";
    shark.style.display = "none";
    finalMessage.style.display = "none";
    levelMsg.innerText = "";
    crowsDiv.style.display = "none";
}

function isColliding(a, b) {
    let r1 = a.getBoundingClientRect();
    let r2 = b.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right ||
            r1.bottom < r2.top || r1.top > r2.bottom);
}
