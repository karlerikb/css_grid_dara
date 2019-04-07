// Elements

const root = document.querySelector(":root");
const gameboardElement = document.querySelector(".gameboard");
const playerTurnInHints = document.querySelector(".hintsContainer .playerTurn");
const playerTurnDescription = document.querySelector(".hintsContainer .turnDescription");
const playerTurnAdditionalDescription = document.querySelector(".hintsContainer .additionalDescription");
const gamePhaseInHints = document.querySelector(".hintsContainer .gamePhase");


// Variables

let activePlayer;
let animationInProgress = false;
const gameboardPieces = [];
const prohibitedPositions = [];
const gamePhases = ["first", "second"];
const gamePhasesInEstLang = ["esimene", "teine"];
const playerTurnDescriptions = [
  "Vali oma mängunupp (vajuta mängunupu peale).",
  "Paiguta mängunupp lauale (vajuta mõne mängulauale tekkinud positsiooni peale).",
  "Nuppu paigutatakse..."
];
const additionalPlayerTurnDescriptions = [
  "Mängunupu paigutamisel ei tohi tekkida kolmest rida."
];


/* TEMPORARY VARIABLES for Development */
const gamePiecesForEachPlayer = 12;
const animationTime = ".5s";


// Initializing Game

function initGame() {
  createPlayerPieces();
  switchTurnToPlayer("one");
  setInitialDescriptions();
}

initGame();


// Descriptions

function setInitialDescriptions() {
  setPlayerTurnInHints();
  setPlayerTurnDescriptionState(0);
}

function setPlayerTurnInHints() {
  const index = players.findIndex(player => player === activePlayer);
  const player = playersEstLang[index];
  playerTurnInHints.textContent = `${player} kord.`;
}

function setPlayerTurnDescriptionState(index) {
  playerTurnDescription.textContent = playerTurnDescriptions[index];
}

function setGamePhaseDescription() {
  if (gameboardPieces.length < gamePiecesForEachPlayer * 2) {
    gamePhaseInHints.textContent = `Mängu ${gamePhasesInEstLang[0]} faas.`;
  } else {
    gamePhaseInHints.textContent = `Mängu ${gamePhasesInEstLang[1]} faas.`;
  }
}


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
  for (let i = 1; i <= gamePiecesForEachPlayer; i++) {
    const playerPieceElement = document.createElement("div");
    playerPieceElement.setAttribute("id", `p${playerNumber}_${i}`);
    playerPieceElement.className = "piece";
    playerPieceElement.textContent = i;
    playerPieceElement.addEventListener("click", activatePlayerPieceForPhaseOne);
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
  setInitialDescriptions();
  testGamePhase();
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


// Testing for Game Phase
function testGamePhase() {
  if (gameboardPieces.length === gamePiecesForEachPlayer * 2) startPhaseTwo();
}

function startPhaseTwo() {
  setGamePhaseDescription();
  prepareGameboardPieces();
}

function prepareGameboardPieces() {
  const gameboardPieces = Array.from(gameboardElement.children);
  gameboardPieces.forEach(piece => {
    piece.addEventListener("click", activatePlayerPieceForPhaseTwo);
  });
}


function activatePlayerPieceForPhaseTwo(e) {
  const playerNumberString = upperCaseFirstLetter(activePlayer);
  const activatablePieceElements = document.querySelectorAll(`.gameboard > .player${playerNumberString}.piece`);
  const activatablePieces = Array.from(activatablePieceElements);
  if (activatablePieces.includes(e.target)) {
    highlightActivatedPiece(2, e.target, activatablePieces);
  }
}


// function highlightActivatedPieceForPhaseTwo(activePiece) {
//   activePiece.textContent = activePiece.id;
//   highlightActivatedPiece(2, activePiece)
// }



// Activating Player Piece

function activatePlayerPieceForPhaseOne(e) {
  const playerNumberString = upperCaseFirstLetter(activePlayer);
  const activatedPlayerPiecesElements = document.querySelector(`.player${playerNumberString}.piecesContainer`).children;
  const activatedPlayerPieces = Array.from(activatedPlayerPiecesElements);
  if (activatedPlayerPieces.includes(e.target) && !animationInProgress) {
    setPlayerTurnDescriptionState(1);
    highlightActivatedPiece(1, e.target, activatedPlayerPieces);
  }
}

function highlightActivatedPiece(phase, activePiece, activatedPlayerPieces) {
  // if the piece that is clicked on already is already active
  if (activePiece.classList.contains("active")) {
    removePlayerPieceActivation(activatedPlayerPieces);
    removeGameboardPositions();
    // if the piece that is clicked on isn't already active
  } else {
    setPlayerPieceToActive(activePiece);
    setOtherPiecesToInactive(activePiece, activatedPlayerPieces);
    createGameboardPositions(phase, activePiece, activatedPlayerPieces);
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

function createGameboardPositions(phase, activePiece, activatedPlayerPieces) {
  removeGameboardPositions();
  if (phase === 1) createGameboardPositionElementsForPhaseOne(activePiece, activatedPlayerPieces);
  if (phase === 2) createGameboardPositionElementsForPhaseTwo(activePiece, activatedPlayerPieces);
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

function createGameboardPositionElementsForPhaseOne(activePiece, activatedPlayerPieces) {
  for (let row = 1; row <= 5; row++) {
    for (let column = 1; column <= 6; column++) {
      const position = `a${row}${column}`;
      if (prohibitedPositions.includes(position)) continue;
      createTemporaryPositionElement(position, activePiece, activatedPlayerPieces);
    }
  }
}

function createGameboardPositionElementsForPhaseTwo(activePiece, activatedPlayerPieces) {
  const piecePosition = window.getComputedStyle(activePiece).gridArea.split("/")[0].trim();
  createTemporaryPositionElementsForPhaseTwo(piecePosition, activePiece, activatedPlayerPieces);
}

function createTemporaryPositionElementsForPhaseTwo(piecePosition, activePiece, activatedPlayerPieces) {
  const pieceRow = +piecePosition[1];
  const pieceColumn = +piecePosition[2];

  const topPosition = (pieceRow > 1) ? pieceRow - 1 : null;
  const bottomPosition = (pieceRow < 5) ? pieceRow + 1 : null;
  const leftPosition = (pieceColumn > 1) ? pieceColumn - 1 : null;
  const rightPosition = (pieceColumn < 6) ? pieceColumn + 1 : null;

  const topArea = (topPosition) ? `a${topPosition}${pieceColumn}` : null;
  const bottomArea = (bottomPosition) ? `a${bottomPosition}${pieceColumn}`: null;
  const leftArea = (leftPosition) ? `a${pieceRow}${leftPosition}` : null;
  const rightArea = (rightPosition) ? `a${pieceRow}${rightPosition}` : null;

  const areas = [topArea, bottomArea, leftArea, rightArea];

  areas.forEach(area => {
    if (area && !prohibitedPositions.includes(area)) {
      createTemporaryPositionElementForPhaseTwo(area, activePiece, activatedPlayerPieces);
    }
  });
}

function createTemporaryPositionElementForPhaseTwo(area, activePiece, activatedPlayerPieces) {
  const temporaryPositionElement = document.createElement("div");
  temporaryPositionElement.className = "temporaryPosition";
  temporaryPositionElement.style.gridArea = area;
  temporaryPositionElement.addEventListener("click", moveActivePieceToGameboard);
  temporaryPositionElement.activePiece = activePiece;
  temporaryPositionElement.activatedPlayerPieces = activatedPlayerPieces;
  gameboardElement.appendChild(temporaryPositionElement);
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
  const playerPieceElement = e.target.activePiece;
  const gameboardPositionElement = e.target;
  const activatedPlayerPieces = e.target.activatedPlayerPieces;
  if (!animationInProgress) {
    animateMovementBetweenGrids(playerPieceElement, gameboardPositionElement, activatedPlayerPieces);
  }
}

function addPlayerPieceToGameboard(playerPieceId, gameboardPositionElement) {
  const gameboardPositionArea = window.getComputedStyle(gameboardPositionElement).gridArea.split("/")[0].trim();
  configureGameboardPiecesLogic(playerPieceId, gameboardPositionArea);
  createPlayerPieceElement(playerPieceId, gameboardPositionArea);
}

function configureGameboardPiecesLogic(playerPieceId, gameboardPositionArea) {
  if (!gameboardPieces.includes(playerPieceId)) {
    gameboardPieces.push(playerPieceId);
    prohibitedPositions.push(gameboardPositionArea);
  } else {
    const index = gameboardPieces.findIndex(pieceId => pieceId === playerPieceId);
    prohibitedPositions.splice(index, 1);
    gameboardPieces.splice(index, 1);
    gameboardPieces.push(playerPieceId);
    prohibitedPositions.push(gameboardPositionArea);
  }
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

  /* temporary setting for development */
  root.style.setProperty("--animationTime", animationTime);

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
  setPlayerTurnDescriptionState(2);
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