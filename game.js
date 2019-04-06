// Elements


// Initializing Game

function initGame() {
  createPlayerPieces();
}

initGame();


function createPlayerPieces() {
  players.forEach((player, number) => {
    const playerNumber = number + 1;
    const playerNumberString = upperCaseFirstLetter(player);
    const piecesContainerElement = document.querySelector(`.player${playerNumberString}.piecesContainer`);
    createPlayerPieceElements(piecesContainerElement, playerNumber);
  });
}

function createPlayerPieceElements(piecesContainerElement, playerNumber) {
  for (let i = 1; i <= 12; i++) {
    const playerPieceElement = document.createElement("div");
    playerPieceElement.setAttribute("id", `p${playerNumber}_${i}`);
    playerPieceElement.className = "piece";
    playerPieceElement.textContent = i;
    piecesContainerElement.appendChild(playerPieceElement);
  }
}