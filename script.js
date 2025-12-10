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

let bgMusic = document.getElementById("bgMusic");

let pos = 0;
let interval = null;
let sharkInterval = null;
let health = 100; // Player health starts at 100%
let lives = 3; // Player has 3 lives
let gameActive = false; // Track if game is active
let currentLevel = 0; // Track current level

// Health elements
let healthBar = document.getElementById("healthBar");
let livesDisplay = document.getElementById("livesDisplay");

/* ENHANCED BACKGROUND EFFECTS */
let backgroundIntervals = [];

// Create animated water particles
function createWaterParticles() {
    const container = document.getElementById('water-particles');
    container.innerHTML = ''; // Clear existing particles

    // Create particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('water-particle');

        // Random size and position
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 900 + 'px';
        particle.style.top = Math.random() * 250 + 'px';

        // Random animation duration
        const duration = Math.random() * 4 + 2;
        particle.style.animationDuration = duration + 's';

        container.appendChild(particle);
    }
}

// Create animated fish
function createFish() {
    const gameArea = document.getElementById('game-area');

    // Remove existing fish
    const existingFish = document.querySelectorAll('.fish');
    existingFish.forEach(f => f.remove());

    // Create new fish
    for (let i = 0; i < 3; i++) {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        // Create a simple fish shape using CSS
        fish.style.background = 'radial-gradient(circle at 30% 50%, #ff6b6b, #ff8e8e)';
        fish.style.borderRadius = '50% 10% 50% 10%';
        fish.style.width = '30px';
        fish.style.height = '15px';
        fish.style.border = '1px solid #d63031';
        fish.style.top = (Math.random() * 200 + 25) + 'px';

        // Add a simple tail
        const tail = document.createElement('div');
        tail.style.position = 'absolute';
        tail.style.left = '-8px';
        tail.style.top = '2px';
        tail.style.width = '0';
        tail.style.height = '0';
        tail.style.borderTop = '6px solid transparent';
        tail.style.borderBottom = '6px solid transparent';
        tail.style.borderRight = '8px solid #d63031';

        fish.appendChild(tail);

        // Random animation duration and delay
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        fish.style.animationDuration = duration + 's';
        fish.style.animationDelay = delay + 's';

        gameArea.appendChild(fish);
    }
}

// Create animated bubbles
function createBubbles() {
    const gameArea = document.getElementById('game-area');

    // Remove existing bubbles
    const existingBubbles = document.querySelectorAll('.bubble');
    existingBubbles.forEach(b => b.remove());

    // Create new bubbles
    for (let i = 0; i < 10; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Random size, position, and animation
        const size = Math.random() * 10 + 5;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 900 + 'px';
        bubble.style.bottom = '0px'; // Start from bottom

        // Random animation duration and delay
        const duration = Math.random() * 6 + 4;
        const delay = Math.random() * 3;
        bubble.style.animationDuration = duration + 's';
        bubble.style.animationDelay = delay + 's';

        gameArea.appendChild(bubble);
    }
}

// Initialize background elements
function initBackground() {
    createWaterParticles();
    createFish();
    createBubbles();

    // Update particles periodically
    if (backgroundIntervals.length > 0) {
        backgroundIntervals.forEach(interval => clearInterval(interval));
    }

    // Recreate particles occasionally for continuous animation
    backgroundIntervals.push(setInterval(createWaterParticles, 5000));
    backgroundIntervals.push(setInterval(createFish, 8000));
    backgroundIntervals.push(setInterval(createBubbles, 4000));
}

// Initialize background when page loads
window.addEventListener('load', initBackground);

/* LEVEL SELECT */
level1Btn.addEventListener("click", () => {
    bgMusic.play();
    levelSelect.style.display = "none";
    currentLevel = 1;
    startLevel1();
});

level2Btn.addEventListener("click", () => {
    bgMusic.play();
    levelSelect.style.display = "none";
    currentLevel = 2;
    startLevel2();
});

// Add more levels
let level3Btn = document.getElementById("level3Btn");
let level4Btn = document.getElementById("level4Btn");

if(level3Btn) {
    level3Btn.addEventListener("click", () => {
        bgMusic.play();
        levelSelect.style.display = "none";
        currentLevel = 3;
        startLevel3();
    });
}

if(level4Btn) {
    level4Btn.addEventListener("click", () => {
        bgMusic.play();
        levelSelect.style.display = "none";
        currentLevel = 4;
        startLevel4();
    });
}

refreshBtn.addEventListener("click", () => location.reload());

/* LEVEL 1 */
function startLevel1() {
    resetObjects();
    levelMsg.innerText = "🚤 Level 1 — Eat the food!";
    document.getElementById("player").classList.add("player-animate");

    // Create power-up for Level 1
    createPowerUp();

    interval = setInterval(moveBoatLevel1, 20);
}

function moveBoatLevel1() {
    pos += (activePowerUps.speed ? 4.5 : 3); // Increase speed if speed power-up is active
    boatContainer.style.left = pos + "px";

    if (isColliding(boatContainer, food)) finishLevel1();

    // Check collisions with power-ups
    for(let i = 0; i < powerUps.length; i++) {
        if(powerUps[i] && !powerUps[i].collected && isColliding(boatContainer, powerUps[i].element)) {
            collectPowerUp(powerUps[i]);
            // Create a new power-up after collection
            setTimeout(createPowerUp, 3000); // New power-up appears after 3 seconds
        }
    }
}

function finishLevel1() {
    clearInterval(interval);
    document.getElementById("player").classList.remove("player-animate");
    food.style.display = "none";
    score.innerText = Number(score.innerText) + 1;

    finalMessage.style.display = "block";
    finalMessage.innerText = "🎉 PANHAGGA! Level 1 Completed!";
    levelMsg.innerText = "";

    crowsDiv.style.display = "block";
    crowsDiv.innerHTML = "";
    for (let i = 0; i < 40; i++) {
        let img = document.createElement("img");
        img.src = "assets/crow.png";
        img.classList.add("crow-img");
        crowsDiv.appendChild(img);
    }

    refreshBtn.style.display = "inline-block";

    // Play win sound
    playSound('win');
}

/* LEVEL 2 */
function startLevel2() {
    resetObjects();
    levelMsg.innerText = "⚔ Level 2 — Avoid the Crow!";
    document.getElementById("player").classList.add("player-animate");
    shark.style.display = "block";
    shark.style.left = "800px";

    // Create power-up for Level 2
    createPowerUp();

    interval = setInterval(moveBoatLevel2, 20);
    sharkInterval = setInterval(moveShark, 30);
}

function moveBoatLevel2() {
    pos += (activePowerUps.speed ? 5.4 : 3.6); // Increase speed if speed power-up is active
    boatContainer.style.left = pos + "px";

    if (isColliding(boatContainer, shark)) {
        // Check if shield power-up is active
        if(activePowerUps.shield) {
            // Shield protects from one collision
            activePowerUps.shield = false;
            finalMessage.style.display = "block";
            finalMessage.style.color = "gold";
            finalMessage.innerText = "🛡️ Shield absorbed the hit!";
            setTimeout(() => {
                if(finalMessage.innerText.includes("Shield absorbed")) {
                    finalMessage.style.display = "none";
                }
            }, 1000);
        } else {
            gameOver();
        }
    }
    if (isColliding(boatContainer, food)) winLevel2();

    // Check collisions with power-ups
    for(let i = 0; i < powerUps.length; i++) {
        if(powerUps[i] && !powerUps[i].collected && isColliding(boatContainer, powerUps[i].element)) {
            collectPowerUp(powerUps[i]);
            // Create a new power-up after collection
            setTimeout(createPowerUp, 3000); // New power-up appears after 3 seconds
        }
    }
}

let sharkDir = -1;
function moveShark() {
    let x = shark.offsetLeft;
    if (x <= 0) sharkDir = 1;
    if (x >= 760) sharkDir = -1;
    shark.style.left = x + (4 * sharkDir) + "px";
}

/* RESULTS */
function gameOver() {
    clearInterval(interval);
    clearInterval(sharkInterval);
    document.getElementById("player").classList.remove("player-animate");
    bgMusic.pause();
    bgMusic.currentTime = 0;
    finalMessage.style.display = "block";
    finalMessage.innerText = "💀 GAME OVER — Crow got you!";
    levelMsg.innerText = "";
    refreshBtn.style.display = "inline-block";

    // Play lose sound
    playSound('lose');
}

function winLevel2() {
    clearInterval(interval);
    clearInterval(sharkInterval);
    document.getElementById("player").classList.remove("player-animate");
    bgMusic.pause();
    score.innerText = Number(score.innerText) + 1;

    finalMessage.style.display = "block";
    finalMessage.innerText = "🏆 YOU BEAT LEVEL 2!";
    levelMsg.innerText = "";
    refreshBtn.style.display = "inline-block";

    // Play win sound
    playSound('win');
}

/* LEVEL 3 - Challenge Level */
let extraFood = [];
let extraObstacles = [];
let powerUps = []; // Array to hold power-up items
let activePowerUps = {}; // Object to track active power-ups

function startLevel3() {
    resetObjects();
    levelMsg.innerText = "🌊 Level 3 — Collect 3 foods while avoiding obstacles!";

    // Create additional food items
    for(let i = 0; i < 3; i++) {
        let extraFoodItem = document.createElement('img');
        extraFoodItem.src = "assets/food.jpg";
        extraFoodItem.classList.add('extra-food');
        extraFoodItem.style.position = "absolute";
        extraFoodItem.style.width = "60px";
        extraFoodItem.style.top = (Math.random() * 150 + 20) + "px";
        extraFoodItem.style.left = (Math.random() * 700 + 300) + "px";
        document.getElementById('game-area').appendChild(extraFoodItem);
        extraFood.push(extraFoodItem);
    }

    // Create moving obstacles
    for(let i = 0; i < 2; i++) {
        let obstacle = document.createElement('img');
        obstacle.src = "assets/shark.png";
        obstacle.classList.add('obstacle');
        obstacle.style.position = "absolute";
        obstacle.style.width = "80px";
        obstacle.style.top = (Math.random() * 150 + 20) + "px";
        obstacle.style.left = (i % 2 === 0 ? 0 : 800) + "px";
        document.getElementById('game-area').appendChild(obstacle);
        extraObstacles.push({
            element: obstacle,
            direction: i % 2 === 0 ? 1 : -1,
            speed: 2 + Math.random() * 2
        });
    }

    document.getElementById("player").classList.add("player-animate");
    interval = setInterval(moveBoatLevel3, 20);
    startMovingObstacles();
}

function moveBoatLevel3() {
    pos += 3.6;
    boatContainer.style.left = pos + "px";

    // Check collisions with extra obstacles
    for(let obs of extraObstacles) {
        if(isColliding(boatContainer, obs.element)) {
            // Check if shield power-up is active
            if(activePowerUps.shield) {
                // Shield protects from one collision
                activePowerUps.shield = false;
                finalMessage.style.display = "block";
                finalMessage.style.color = "gold";
                finalMessage.innerText = "🛡️ Shield absorbed the hit!";
                setTimeout(() => {
                    if(finalMessage.innerText.includes("Shield absorbed")) {
                        finalMessage.style.display = "none";
                    }
                }, 1000);
            } else {
                decreaseHealth(20);
                if(lives > 0) {
                    // Reset obstacle position
                    obs.directionX *= -1;
                    obs.element.style.left = pos < 400 ? "0px" : "800px";
                }
            }
        }
    }

    // Check collisions with power-ups
    for(let i = 0; i < powerUps.length; i++) {
        if(powerUps[i] && !powerUps[i].collected && isColliding(boatContainer, powerUps[i].element)) {
            collectPowerUp(powerUps[i]);
            // Create a new power-up after collection
            setTimeout(createPowerUp, 3000); // New power-up appears after 3 seconds
        }
    }

    // Check collisions with extra food items
    for(let i = 0; i < extraFood.length; i++) {
        if(extraFood[i] && isColliding(boatContainer, extraFood[i])) {
            extraFood[i].remove();
            extraFood.splice(i, 1);
            i--; // Adjust index after removing
            score.innerText = Number(score.innerText) + 1;

            if(extraFood.length === 0) {
                finishLevel3();
            }
        }
    }

    // End level if out of bounds
    if(pos > 850) {
        gameOver();
    }
}

function startMovingObstacles() {
    clearInterval(sharkInterval);
    sharkInterval = setInterval(() => {
        for(let obs of extraObstacles) {
            let currentLeft = parseInt(obs.element.style.left) || 0;
            let currentTop = parseInt(obs.element.style.top) || 0;

            switch(obs.behavior) {
                case 'horizontal':
                    // Horizontal movement - back and forth
                    let newLeft = currentLeft + (obs.speed * obs.directionX);

                    // Reverse direction if hitting boundary
                    if(newLeft <= 0 || newLeft >= 750) {
                        obs.directionX *= -1;
                        newLeft = newLeft <= 0 ? 0 : 750;
                    }

                    obs.element.style.left = newLeft + "px";
                    break;

                case 'vertical':
                    // Vertical movement - up and down
                    let newTop = currentTop + (obs.speed * obs.directionY);

                    // Reverse direction if hitting boundary
                    if(newTop <= 0 || newTop >= 150) {
                        obs.directionY *= -1;
                        newTop = newTop <= 0 ? 0 : 150;
                    }

                    obs.element.style.top = newTop + "px";
                    break;

                case 'diagonal':
                    // Diagonal movement - both horizontal and vertical
                    newLeft = currentLeft + (obs.speed * obs.directionX * 0.7);
                    newTop = currentTop + (obs.speed * obs.directionY * 0.7);

                    // Reverse directions if hitting boundaries
                    if(newLeft <= 0 || newLeft >= 750) {
                        obs.directionX *= -1;
                    }

                    if(newTop <= 0 || newTop >= 150) {
                        obs.directionY *= -1;
                    }

                    obs.element.style.left = newLeft + "px";
                    obs.element.style.top = newTop + "px";
                    break;
            }
        }
    }, 30);
}

function finishLevel3() {
    clearInterval(interval);
    clearInterval(sharkInterval);
    document.getElementById("player").classList.remove("player-animate");

    // Clean up extra elements
    extraFood.forEach(food => food.remove());
    extraObstacles.forEach(obs => obs.element.remove());
    extraFood = [];
    extraObstacles = [];

    finalMessage.style.display = "block";
    finalMessage.innerText = "🎉 AMAZING! Level 3 Completed!";
    levelMsg.innerText = "";
    refreshBtn.style.display = "inline-block";
}

/* LEVEL 4 - Timed Survival */
let timerInterval = null;
let timer = 60; // 60 seconds for level 4
let timerDisplay = document.getElementById("timerDisplay");

function startLevel4() {
    resetObjects();
    levelMsg.innerText = "⏱ Level 4 — Survive for 60 seconds!";

    // Show and update timer
    if(timerDisplay) {
        timerDisplay.style.display = "block";
        updateTimerDisplay();
    }

    // Create multiple moving obstacles with different behaviors
    for(let i = 0; i < 3; i++) {
        let obstacle = document.createElement('img');
        obstacle.src = "assets/shark.png";
        obstacle.classList.add('obstacle');
        obstacle.style.position = "absolute";
        obstacle.style.width = "80px";
        obstacle.style.top = (Math.random() * 150 + 20) + "px";
        obstacle.style.left = (Math.random() * 700 + 50) + "px";
        document.getElementById('game-area').appendChild(obstacle);

        // Different behaviors for different obstacles
        let behavior;
        switch(i) {
            case 0:
                behavior = 'horizontal'; // Moves back and forth horizontally
                break;
            case 1:
                behavior = 'vertical'; // Moves up and down
                break;
            case 2:
                behavior = 'diagonal'; // Moves diagonally
                break;
            default:
                behavior = 'horizontal';
        }

        extraObstacles.push({
            element: obstacle,
            directionX: i % 2 === 0 ? 1 : -1,
            directionY: 1,
            speed: 1.5 + Math.random() * 2.5,
            behavior: behavior,
            originalTop: parseInt(obstacle.style.top),
            originalLeft: parseInt(obstacle.style.left)
        });
    }

    // Create power-ups for Level 4
    createPowerUp();

    document.getElementById("player").classList.add("player-animate");
    interval = setInterval(moveBoatLevel4, 20);
    startMovingObstacles();

    // Start timer countdown
    timer = 60;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();

        if(timer <= 0) {
            finishLevel4();
        }
    }, 1000);
}

function moveBoatLevel4() {
    // Allow player to move up and down as well as forward
    updatePlayerPosition(); // Update player position based on key presses

    // Move obstacles and check collisions
    for(let obs of extraObstacles) {
        let currentLeft = parseInt(obs.element.style.left) || 0;
        let currentTop = parseInt(obs.element.style.top) || 0;

        // Different movement patterns based on behavior
        switch(obs.behavior) {
            case 'horizontal':
                let newLeft = currentLeft + (obs.speed * obs.directionX);

                // Reverse direction if hitting boundary
                if(newLeft <= 0 || newLeft >= 750) {
                    obs.directionX *= -1;
                    newLeft = newLeft <= 0 ? "0" : "750";
                } else {
                    obs.element.style.left = newLeft + "px";
                }
                break;

            case 'vertical':
                let newTop = currentTop + (obs.speed * obs.directionY);

                // Reverse direction if hitting boundary
                if(newTop <= 0 || newTop >= 150) {
                    obs.directionY *= -1;
                    newTop = newTop <= 0 ? "0" : "150";
                } else {
                    obs.element.style.top = newTop + "px";
                }
                break;

            case 'diagonal':
                newLeft = currentLeft + (obs.speed * obs.directionX * 0.7);
                newTop = currentTop + (obs.speed * obs.directionY * 0.7);

                // Reverse directions if hitting boundaries
                if(newLeft <= 0 || newLeft >= 750) {
                    obs.directionX *= -1;
                }

                if(newTop <= 0 || newTop >= 150) {
                    obs.directionY *= -1;
                }

                obs.element.style.left = newLeft + "px";
                obs.element.style.top = newTop + "px";
                break;
        }

        // Check collision with boat
        if(isColliding(boatContainer, obs.element)) {
            // Check if shield power-up is active
            if(activePowerUps.shield) {
                // Shield protects from one collision
                activePowerUps.shield = false;
                finalMessage.style.display = "block";
                finalMessage.style.color = "gold";
                finalMessage.innerText = "🛡️ Shield absorbed the hit!";
                setTimeout(() => {
                    if(finalMessage.innerText.includes("Shield absorbed")) {
                        finalMessage.style.display = "none";
                    }
                }, 1000);
            } else {
                decreaseHealth(10);
                if(lives > 0) {
                    // Move obstacle to random position
                    obs.element.style.left = (Math.random() * 700 + 50) + "px";
                    obs.element.style.top = (Math.random() * 150 + 20) + "px";
                }
            }
        }
    }

    // Check collisions with power-ups
    for(let i = 0; i < powerUps.length; i++) {
        if(powerUps[i] && !powerUps[i].collected && isColliding(boatContainer, powerUps[i].element)) {
            collectPowerUp(powerUps[i]);
            // Create a new power-up after collection
            setTimeout(createPowerUp, 3000); // New power-up appears after 3 seconds
        }
    }
}

function updateTimerDisplay() {
    if(timerDisplay) {
        timerDisplay.innerText = `Time: ${timer}s`;
        // Change color when time is running low
        if(timer <= 10) {
            timerDisplay.style.color = "red";
            timerDisplay.style.fontWeight = "bold";
        } else {
            timerDisplay.style.color = "#006cff";
            timerDisplay.style.fontWeight = "normal";
        }
    }
}

function finishLevel4() {
    clearInterval(interval);
    clearInterval(sharkInterval);
    clearInterval(timerInterval);
    document.getElementById("player").classList.remove("player-animate");

    // Clean up
    extraObstacles.forEach(obs => obs.element.remove());
    extraObstacles = [];

    if(timerDisplay) timerDisplay.style.display = "none";

    finalMessage.style.display = "block";
    finalMessage.innerText = "🎉 VICTORY! You survived Level 4!";
    levelMsg.innerText = "";
    refreshBtn.style.display = "inline-block";
}

// Keyboard controls for vertical movement
let keys = {};
function handleKeyDown(e) {
    keys[e.key] = true;

    // Prevent scrolling with arrow keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function updatePlayerPosition() {
    // Only allow vertical movement in Level 4
    if(currentLevel === 4) {
        let topPos = parseInt(boatContainer.style.top) || 70; // default to 70 if not set

        if(keys['ArrowUp'] && topPos > 20) {
            topPos -= 5;
        }
        if(keys['ArrowDown'] && topPos < 180) {
            topPos += 5;
        }

        boatContainer.style.top = topPos + "px";
    }
}

/* UTIL */
function resetObjects() {
    pos = 0;
    boatContainer.style.left = "0px";
    boatContainer.style.top = "70px"; // Reset vertical position
    food.style.display = "block";
    shark.style.display = "none";
    crowsDiv.style.display = "none";
    finalMessage.style.display = "none";
    levelMsg.innerText = "";
    health = 100; // Reset health
    updateHealthDisplay(); // Update health display

    // Clear key presses
    keys = {};
}

function updateHealthDisplay() {
    if (healthBar) {
        healthBar.style.width = health + "%";
        healthBar.parentElement.querySelector('.health-text').innerText = `${health}%`;
    }

    if (livesDisplay) {
        livesDisplay.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            livesDisplay.innerHTML += '❤️ ';
        }
    }
}

function decreaseHealth(amount) {
    health -= amount;
    if (health <= 0) {
        health = 0;
        loseLife();
    }
    updateHealthDisplay();

    // Play hit sound
    playSound('hit');
}

function gainHealth(amount) {
    health += amount;
    if (health > 100) health = 100;
    updateHealthDisplay();

    // Play collect sound
    playSound('collect');
}

function loseLife() {
    lives--;
    if (lives <= 0) {
        gameOver();
    } else {
        // Reset health when losing a life
        health = 100;
        updateHealthDisplay();
        // Briefly flash the screen to indicate damage
        document.body.style.backgroundColor = 'red';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 300);
    }
}

// Function to create power-ups
function createPowerUp() {
    // Clear any existing power-ups
    powerUps.forEach(powerUp => {
        if(powerUp.element && powerUp.element.parentNode) {
            powerUp.element.parentNode.removeChild(powerUp.element);
        }
    });
    powerUps = [];

    // Create a random power-up
    if(Math.random() > 0.3) { // 70% chance to create a power-up
        let powerUpTypes = ['health', 'speed', 'shield'];
        let randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

        let powerUp = document.createElement('img');
        powerUp.classList.add('power-up');

        // Set different images based on power-up type
        switch(randomType) {
            case 'health':
                powerUp.src = "assets/food.jpg"; // Use food image for health
                powerUp.title = "Health Boost";
                break;
            case 'speed':
                powerUp.src = "assets/boat.png"; // Use boat image for speed
                powerUp.title = "Speed Boost";
                break;
            case 'shield':
                powerUp.src = "assets/player.jpg"; // Use player image for shield
                powerUp.title = "Shield";
                break;
        }

        powerUp.style.position = "absolute";
        powerUp.style.width = "50px";
        powerUp.style.top = (Math.random() * 150 + 20) + "px";
        powerUp.style.left = (Math.random() * 700 + 100) + "px";
        powerUp.style.zIndex = "10";
        // Add animation class
        powerUp.classList.add('pulse-animation');

        document.getElementById('game-area').appendChild(powerUp);

        powerUps.push({
            element: powerUp,
            type: randomType,
            collected: false
        });
    }
}

// Function to handle power-up collection
function collectPowerUp(powerUp) {
    if(powerUp.collected) return;

    powerUp.collected = true;
    powerUp.element.style.display = 'none'; // Hide the power-up

    // Play power-up sound
    playSound('powerup');

    // Apply power-up effect based on type
    switch(powerUp.type) {
        case 'health':
            gainHealth(30); // Add 30% health
            finalMessage.style.display = "block";
            finalMessage.style.color = "green";
            finalMessage.innerText = "💚 Health Boost Collected!";
            setTimeout(() => {
                if(finalMessage.innerText.includes("Health Boost")) {
                    finalMessage.style.display = "none";
                }
            }, 1500);
            break;

        case 'speed':
            // Temporarily increase boat speed
            activePowerUps.speed = true;
            finalMessage.style.display = "block";
            finalMessage.style.color = "blue";
            finalMessage.innerText = "🚀 Speed Boost Activated!";
            setTimeout(() => {
                if(finalMessage.innerText.includes("Speed Boost")) {
                    finalMessage.style.display = "none";
                }
            }, 1500);

            // Remove speed boost after 10 seconds
            setTimeout(() => {
                activePowerUps.speed = false;
            }, 10000);
            break;

        case 'shield':
            // Temporary shield - ignores one collision
            activePowerUps.shield = true;
            finalMessage.style.display = "block";
            finalMessage.style.color = "gold";
            finalMessage.innerText = "🛡️ Shield Activated!";
            setTimeout(() => {
                if(finalMessage.innerText.includes("Shield")) {
                    finalMessage.style.display = "none";
                }
            }, 1500);

            // Remove shield after 15 seconds
            setTimeout(() => {
                activePowerUps.shield = false;
            }, 15000);
            break;
    }
}

function isColliding(a, b) {
    let r1 = a.getBoundingClientRect();
    let r2 = b.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right ||
             r1.bottom < r2.top || r1.top > r2.bottom);
}
