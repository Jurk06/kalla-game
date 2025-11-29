let boatContainer = document.getElementById("boatContainer");
let food = document.getElementById("food");
let score = document.getElementById("score");
let startBtn = document.getElementById("startBtn");
let finalMessage = document.getElementById("finalMessage");
let refreshBtn = document.getElementById("refreshBtn");
let crowsDiv = document.getElementById("crows");

let pos = 0;
let interval = null;

startBtn.addEventListener("click", function () {
    if (interval) return;
    interval = setInterval(moveBoat, 20);
});

refreshBtn.addEventListener("click", function () {
    location.reload();
});

function moveBoat() {
    pos += 3;
    boatContainer.style.left = pos + "px";

    if (isColliding(boatContainer, food)) {
        food.style.display = "none";
        score.innerText = Number(score.innerText) + 1;
        clearInterval(interval);

        finalMessage.style.display = "block";
        finalMessage.innerText = "🎉 PANHAGGA! 🎉";

        // show multiple crows
        crowsDiv.style.display = "block";
        crowsDiv.innerHTML = "";
        for (let i = 0; i < 12; i++) {  // change number to add/remove crows
            let img = document.createElement("img");
            img.src = "assets/crow.png";
            img.classList.add("crow-img");
            crowsDiv.appendChild(img);
        }

        refreshBtn.style.display = "inline-block";
    }

    if (pos > 760) clearInterval(interval);
}

function isColliding(a, b) {
    let rec1 = a.getBoundingClientRect();
    let rec2 = b.getBoundingClientRect();
    return !(rec1.right < rec2.left ||
            rec1.left > rec2.right ||
            rec1.bottom < rec2.top ||
            rec1.top > rec2.bottom);
}
