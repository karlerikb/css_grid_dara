// Elements

const root = document.querySelector(":root");
const gameboardElement = document.querySelector(".gameboard");


// Variables

let activePlayer;
let animationInProgress = false;
const gameboardPieces = [];
const prohibitedPositions = [];


// Initializing Game

function initGame() {
  createPlayerPieces();
  switchTurnToPlayer("one");
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

function createPlayerPieceElement(playerPieceId, position) {
  const playerPieceElement = document.createElement("div");
  const number = players[+(playerPieceId[1]) - 1];
  const numberString = upperCaseFirstLetter(number);
  playerPieceElement.setAttribute("id", playerPieceId);
  playerPieceElement.className = `player${numberString} piece`;
  playerPieceElement.style.gridArea = position;
  gameboardElement.appendChild(playerPieceElement);
}


// Switching Game Turn

function switchTurnToPlayer(playerNumber) {
  activePlayer = playerNumber;
  scrollToActivePlayerPiecesContainer(playerNumber);
  activatingCurrentPlayer(playerNumber);
  deactivatingOpponentPlayer(playerNumber);
}

function activatingCurrentPlayer(playerNumber) {
  const playerNumberString = upperCaseFirstLetter(playerNumber);
  const piecesContainerElement = document.querySelector(`.player${playerNumberString}.piecesContainer`);
  piecesContainerElement.classList.add("active");
}

function deactivatingOpponentPlayer(playerNumber) {
  const opponentPlayerNumber = players.filter(player => player !== playerNumber);
  const opponentPlayerNumberString = upperCaseFirstLetter(opponentPlayerNumber[0]);
  const piecesContainerElement = document.querySelector(`.player${opponentPlayerNumberString}.piecesContainer`);
  if (piecesContainerElement.classList.contains("active")) piecesContainerElement.classList.remove("active");
}

function scrollToActivePlayerPiecesContainer(playerNumber) {
  const playerNumberString = upperCaseFirstLetter(playerNumber);
  const piecesContainerElement = document.querySelector(`.player${playerNumberString}.piecesContainer`);
  piecesContainerElement.scrollIntoView({ behavior: "smooth" });
}


// Activating Player Piece

function activatePlayerPiece(e) {
  const playerNumberString = upperCaseFirstLetter(activePlayer);
  const activatedPlayerPiecesElements = document.querySelector(`.player${playerNumberString}.piecesContainer`).children;
  const activatedPlayerPieces = Array.from(activatedPlayerPiecesElements);
  if (activatedPlayerPieces.includes(e.target) && !animationInProgress) {
    highlightActivatedPiece(e.target, activatedPlayerPieces);
  }
}

function highlightActivatedPiece(activePiece, activatedPlayerPieces) {
  // if the piece that is clicked on already is already active
  if (activePiece.classList.contains("active")) {
    removePlayerPieceActivation(activatedPlayerPieces);
    removeGameboardPositions();
    // if the piece that is clicked on isn't already active
  } else {
    setPlayerPieceToActive(activePiece);
    setOtherPiecesToInactive(activePiece, activatedPlayerPieces);
    createGameboardPositions(activePiece, activatedPlayerPieces);
  }
}

function removePlayerPieceActivation(activatedPlayerPieces) {
  activatedPlayerPieces.forEach(piece => {
    if (piece.classList.contains("active")) piece.classList.remove("active");
    if (piece.classList.contains("inactive")) piece.classList.remove("inactive");
  });
}

function setPlayerPieceToActive(activePiece) {
  activePiece.classList.add("active");
  if (activePiece.classList.contains("inactive")) activePiece.classList.remove("inactive");
}

function setOtherPiecesToInactive(activePiece, activatedPlayerPieces) {
  const inactivePieces = activatedPlayerPieces.filter(piece => piece !== activePiece);
  inactivePieces.forEach(piece => {
    if (!piece.classList.contains("inactive")) piece.classList.add("inactive");
    // make previous active piece inactive
    if (piece.classList.contains("active") && piece != activePiece) piece.classList.remove("active");
  });
}

function createGameboardPositions(activePiece, activatedPlayerPieces) {
  removeGameboardPositions();
  createGameboardPositionElements(activePiece, activatedPlayerPieces);
}

function removeGameboardPositions() {
  const temporaryPositionElements = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition"));
  if (temporaryPositionElements) removeGameboardPositionElements(temporaryPositionElements);
}

function removeGameboardPositionElements(temporaryPositions) {
  temporaryPositions.forEach(position => {
    position.remove();
  });
}

function createGameboardPositionElements(activePiece, activatedPlayerPieces) {
  for (let row = 1; row <= 5; row++) {
    for (let column = 1; column <= 6; column++) {
      const position = `a${row}${column}`;
      if (prohibitedPositions.includes(position)) continue;
      createTemporaryPositionElement(position, activePiece, activatedPlayerPieces);
    }
  }
}

function createTemporaryPositionElement(position, activePiece, activatedPlayerPieces) {
  const temporaryPositionElement = document.createElement("div");
  temporaryPositionElement.className = "temporaryPosition";
  temporaryPositionElement.style.gridArea = position;
  temporaryPositionElement.addEventListener("click", moveActivePieceToGameboard);
  temporaryPositionElement.activePiece = activePiece;
  temporaryPositionElement.activatedPlayerPieces = activatedPlayerPieces;
  gameboardElement.appendChild(temporaryPositionElement);
}


// Moving Piece from PiecesContainer to Gameboard

function moveActivePieceToGameboard(e) {
  // const opponentPlayer = (players.filter(player => player !== activePlayer))[0];
  const playerPieceElement = e.target.activePiece;
  const gameboardPositionElement = e.target;
  const activatedPlayerPieces = e.target.activatedPlayerPieces;
  if (!animationInProgress) {
    animateMovementBetweenGrids(playerPieceElement, gameboardPositionElement, activatedPlayerPieces);
  }
}

function addPlayerPieceToGameboard(playerPieceId, gameboardPositionElement) {
  const gameboardPositionArea = window.getComputedStyle(gameboardPositionElement).gridArea.split("/")[0].trim();
  gameboardPieces.push(playerPieceId);
  prohibitedPositions.push(gameboardPositionArea);
  createPlayerPieceElement(playerPieceId, gameboardPositionArea);
}

function removePlayerActivePiece(piece) {
  piece.remove();
}


// Animating Movement Between Grids

function animateMovementBetweenGrids(activePiece, targetPosition, activatedPlayerPieces) {
  const activePieceTop = activePiece.getBoundingClientRect().top;
  const activePieceLeft = activePiece.getBoundingClientRect().left;
  const targetPositionTop = targetPosition.getBoundingClientRect().top;
  const targetPositionLeft = targetPosition.getBoundingClientRect().left;

  root.style.setProperty("--targetPositionTop", (targetPositionTop - activePieceTop) + "px");
  root.style.setProperty("--targetPositionLeft", (targetPositionLeft - activePieceLeft) + "px");

  activePiece.classList.add("moveBetweenGrids");
  activePiece.addEventListener("animationend", animationBetweenGridsEnds);
  activePiece.addEventListener("animationstart", animationStarted);

  activePiece.positionElement = targetPosition;
  activePiece.activatedPlayerPieces = activatedPlayerPieces;
}

function animationBetweenGridsEnds(e) {
  const opponentPlayer = (players.filter(player => player !== activePlayer))[0];
  const playerPieceElement = e.target;
  const targetPositionElement = e.target.positionElement;
  const activatedPlayerPieces = e.target.activatedPlayerPieces;

  addPlayerPieceToGameboard(playerPieceElement.id, targetPositionElement);
  removePlayerActivePiece(playerPieceElement);
  removePlayerPieceActivation(activatedPlayerPieces);
  removeGameboardPositions();
  switchTurnToPlayer(opponentPlayer);
  animationEnded(e);
}

function animationStarted(e) {
  const temporaryPositions = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition"));
  const activatedPieces = e.target.activatedPlayerPieces;
  activatedPieces.forEach(piece => {
    if (!piece.classList.contains("notAllowed")) piece.classList.add("notAllowed");
  });
  temporaryPositions.forEach(temporaryPosition => {
    if (!temporaryPosition.classList.contains("notAllowed")) temporaryPosition.classList.add("notAllowed");
  });
  animationInProgress = true;
}

function animationEnded(e) {
  const temporaryPositions = Array.from(document.querySelectorAll(".gameboard > .temporaryPosition"));
  const activatedPieces = e.target.activatedPlayerPieces;
  activatedPieces.forEach(piece => {
    if (piece.classList.contains("notAllowed")) piece.classList.remove("notAllowed");
  });
  temporaryPositions.forEach(temporaryPosition => {
    if (temporaryPosition.classList.contains("notAllowed")) temporaryPosition.classList.remove("notAllowed");
  });
  animationInProgress = false;
}