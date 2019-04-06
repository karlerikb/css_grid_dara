// Variables

let activePlayer;



// Initializing Game

function initGame() {
  createPlayerPieces();
  switchTurnToPlayer("two");
}

initGame();



// Creating Game Pieces

function createPlayerPieces() {
  players.forEach((player, index) => {
    const playerNumber = index + 1;
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
    playerPieceElement.addEventListener("click", activatePlayerPiece);
    piecesContainerElement.appendChild(playerPieceElement);
  }
}


// Switching Game Turn

function switchTurnToPlayer(playerNumber) {
  activePlayer = playerNumber;
  const playerNumberString = upperCaseFirstLetter(playerNumber);
  const piecesContainerElement = document.querySelector(`.player${playerNumberString}.piecesContainer`);
  piecesContainerElement.classList.add("active");
}


// Activating Player Piece

function activatePlayerPiece(e) {
  const playerNumberString = upperCaseFirstLetter(activePlayer);
  const activatedPlayerPiecesElements = document.querySelector(`.player${playerNumberString}.piecesContainer`).children;
  const activatedPlayerPieces = Array.from(activatedPlayerPiecesElements);
  if (activatedPlayerPieces.includes(e.target)) highlightActivatedPiece(e.target, activatedPlayerPieces);
}

function highlightActivatedPiece(activePiece, activatedPlayerPieces) {
  const inactivePieces = activatedPlayerPieces.filter(piece => piece !== activePiece);
  if (activePiece.classList.contains("active")) {
    activatedPlayerPieces.forEach(piece => {
      if (piece.classList.contains("active")) piece.classList.remove("active");
      if (piece.classList.contains("inactive")) piece.classList.remove("inactive");
    });
  } else {
    activePiece.classList.add("active");
    inactivePieces.forEach(piece => {
      if (!piece.classList.contains("inactive")) piece.classList.add("inactive");
      if (piece.classList.contains("active") && piece != activePiece) piece.classList.remove("active");
    });
  }
  if (activePiece.classList.contains("inactive")) activePiece.classList.remove("inactive");
}

