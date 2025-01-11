const boardSize = 10; // Tamanho do tabuleiro
const gameBoard = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const statusElement = document.getElementById("game-status");

let playerPosition = { x: 0, y: 0 };
let goalPosition = { x: boardSize - 1, y: boardSize - 1 };
let honeypots = [];
let timer = 0;
let gameInterval;

// Gera o tabuleiro
function generateBoard() {
    gameBoard.innerHTML = "";
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (x === playerPosition.x && y === playerPosition.y) {
                cell.classList.add("player");
            } else if (x === goalPosition.x && y === goalPosition.y) {
                cell.classList.add("goal");
            } else if (honeypots.some(h => h.x === x && h.y === y)) {
                cell.classList.add("honeypot");
            }
            gameBoard.appendChild(cell);
        }
    }
}

// Gera honeypots em posições aleatórias
function generateHoneypots(count) {
    honeypots = [];
    while (honeypots.length < count) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (
            (x !== playerPosition.x || y !== playerPosition.y) &&
            (x !== goalPosition.x || y !== goalPosition.y) &&
            !honeypots.some(h => h.x === x && h.y === y)
        ) {
            honeypots.push({ x, y });
        }
    }
}

// Move o jogador
function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
        playerPosition = { x: newX, y: newY };

        if (honeypots.some(h => h.x === newX && h.y === newY)) {
            endGame("Você foi detectado por um honeypot!");
        } else if (newX === goalPosition.x && newY === goalPosition.y) {
            endGame("Parabéns! Você escapou!");
        }

        generateBoard();
    }
}

// Finaliza o jogo
function endGame(message) {
    clearInterval(gameInterval);
    statusElement.textContent = message;
    document.removeEventListener("keydown", handleKeyPress);
}

// Lida com os comandos do teclado
function handleKeyPress(event) {
    if (event.key === "ArrowUp") movePlayer(0, -1);
    else if (event.key === "ArrowDown") movePlayer(0, 1);
    else if (event.key === "ArrowLeft") movePlayer(-1, 0);
    else if (event.key === "ArrowRight") movePlayer(1, 0);
}

// Atualiza o temporizador
function updateTimer() {
    timer++;
    timerElement.textContent = timer;
}

// Inicia o jogo
function startGame() {
    generateHoneypots(15); // Define 15 honeypots
    generateBoard();
    gameInterval = setInterval(updateTimer, 1000);
    document.addEventListener("keydown", handleKeyPress);
}

// Inicia o jogo ao carregar a página
startGame();
