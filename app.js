const editPlayer1ButtonElement = document.getElementById("edit-Player1-btn");
const editPlayer2ButtonElement = document.getElementById("edit-Player2-btn");

const overlayMenu = document.getElementById("form-control");
const backdropElement = document.getElementById("backdrop");
const startNewGameBtn = document.getElementById("new-game-btn");

const cancelBtn = document.getElementById("cancel-btn");
const formElement = document.querySelector("form");
const errorMessageParagraph = document.getElementById("errorMessage");

const activeGameFeild = document.getElementById("active-game-feild");
const listItems = document.querySelectorAll("#game-feild li");
const playerNameElement = document.getElementById("player-name");
const gameOverElement = document.getElementById("game-over");
const orderedListElement=document.getElementById('game-feild')
const player = [
  {
    name: "",
    Symbol: "x",
  },
  {
    name: "",
    Symbol: "o",
  },
];
let editedPlayer = 0;
let activePlayer = 0;
let currentRound = 1;
let gameIsOver=false;
const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function displayOverlay(event) {
  editedPlayer = +event.target.dataset.playerid;
  overlayMenu.style.display = "block";
  backdropElement.style.display = "block";
}
function cancelOverlay() {
  overlayMenu.style.display = "none";
  backdropElement.style.display = "none";
  formElement.classList.remove("error");
  errorMessageParagraph.textContent = "";
  formElement.children[1].value = "";
}
function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayerName = formData.get("playerName").trim();

  if (!enteredPlayerName) {
    event.target.classList.add("error");
    errorMessageParagraph.textContent = "Please enter valid text";
    return;
  }
  const updatedPlayerDataElement = document.getElementById(
    "player-" + editedPlayer + "-data"
  );
  updatedPlayerDataElement.children[1].textContent = enteredPlayerName;
  player[editedPlayer - 1].name = enteredPlayerName;
  cancelOverlay();
}

function displayGameBoard() {
  if (player[0].name === "" || player[1].name === "") {
    alert("Please enter the name of both the players");
    return;
  }

  resetGameStatus();
  playerNameElement.textContent = player[activePlayer].name;

  activeGameFeild.style.display = "block";
}

function switchBetweenPlayers() {
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  playerNameElement.textContent = player[activePlayer].name;
}

function selectedPlayer(event) {
 if(gameIsOver){
  return;
 }
  const selectedFeild = event.target;

  const selectedColumn = selectedFeild.dataset.col - 1;
  const selectedRow = selectedFeild.dataset.row - 1;

  if (gameData[selectedRow][selectedColumn] > 0) {
    alert("This feild is already selected");
    return;
  }
  selectedFeild.textContent = player[activePlayer].Symbol;
  selectedFeild.classList.add("disabled");
  gameData[selectedRow][selectedColumn] = activePlayer + 1;
  const winnerId = checkForGameOver();
  if (winnerId != 0) {
    gameOver(winnerId);
  }
  console.log(winnerId);
  currentRound++;
  switchBetweenPlayers();
}
function checkForGameOver() {
  // checking for rows
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }
  // checking for columns
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[1][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }
  if (
    gameData[0][2] > 0 &&
    gameData[0][2] === gameData[1][1] &&
    gameData[1][1] === gameData[2][0]
  ) {
    return gameData[0][2];
  }
  if (currentRound === 9) {
    return -1;
  }
  return 0;
}

function gameOver(winnerId) {
  gameIsOver=true;
  gameOverElement.style.display = "block";
  if (winnerId > 0) {
    const winnerName = player[winnerId - 1].name;
    gameOverElement.firstElementChild.firstElementChild.textContent =
      winnerName;
  } else {
    gameOverElement.firstElementChild.textContent = "It's a draw";
  }
}

function resetGameStatus() {
  activePlayer = 0;
  currentRound = 1;
  gameIsOver=false;
  gameOverElement.firstElementChild.innerHTML =
    'You won <span id="winner-name">winner name</span>';
    let selectEveryListItem=0;
    for(let i=0;i<3;i++){
      for(j=0;j<3;j++){
        gameData[i][j]=0;
        orderedListElement.children[selectEveryListItem].textContent='';
        
        gameOverElement.style.display='none'
        orderedListElement.children[selectEveryListItem].classList.remove('disabled');
        selectEveryListItem++;
      }
    }
}

editPlayer1ButtonElement.addEventListener("click", displayOverlay);
editPlayer2ButtonElement.addEventListener("click", displayOverlay);
cancelBtn.addEventListener("click", cancelOverlay);
backdropElement.addEventListener("click", cancelOverlay);
formElement.addEventListener("submit", savePlayerConfig);
startNewGameBtn.addEventListener("click", displayGameBoard);
for (const listItem of listItems) {
  listItem.addEventListener("click", selectedPlayer);
}
