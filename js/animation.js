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
  const playerPieceElement = e.target; // targetpiece
  const targetPositionElement = e.target.positionElement; // targetposition
  const activatedPlayerPieces = e.target.activatedPlayerPieces; // playerpieces

  addPlayerPieceToGameboard(playerPieceElement.id, targetPositionElement); // adding new element to targetposition
  removePlayerActivePiece(playerPieceElement); // removing old element (targetpiece)
  removePlayerPieceActivation(activatedPlayerPieces); // resetting
  removeGameboardPositions(); // resetting
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