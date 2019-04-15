import { Helper } from "./Helper.js";

const _gamePiecesForEachPlayer = new WeakMap();
const _animationTime = new WeakMap();

const _app = new WeakMap();
const _targetPiece = new WeakMap();
const _targetPosition = new WeakMap();
const _playerPieces = new WeakMap();
const _animationInProgress = new WeakMap();

const _removeGameboardPositions = new WeakMap();
const _removeActivation = new WeakMap();
const _resetActivation = new WeakMap();
const _animateMovement = new WeakMap();
const _animationStarts = new WeakMap();
const _animationEnds = new WeakMap();
const _movementStarts = new WeakMap();
const _movementEnds = new WeakMap();
const _addTargetPieceToTargetPosition = new WeakMap();
const _switchTurn = new WeakMap();
const _activatePlayer = new WeakMap();
const _deactivatePlayer = new WeakMap();
const _switchPlayers = new WeakMap();
const _scrollToActivePieceContainer = new WeakMap();


export class Game {
  constructor(app) {
    // Temporary development variables
    _gamePiecesForEachPlayer.set(this, 12);
    _animationTime.set(this, ".5s");

    _app.set(this, app);
    _animationInProgress.set(this, false);


    _removeGameboardPositions.set(this, () => {
      const temporaryPositions = this.temporaryPositions;
      if (temporaryPositions) temporaryPositions.forEach(position => position.remove());
    });

    _removeActivation.set(this, () => {
      this.playerPieces.forEach(piece => {
        if (piece.classList.contains("active")) piece.classList.remove("active");
        if (piece.classList.contains("inactive")) piece.classList.remove("inactive");
      });
    });

    _resetActivation.set(this, () => {
      this.removeActivation();
      this.removeGameboardPositions();
    });

    _animateMovement.set(this, () => {
      console.log("moving...");
      const root = this.app.selectors.root;

      const targetPieceTop = this.targetPiece.getBoundingClientRect().top;
      const targetPieceLeft = this.targetPiece.getBoundingClientRect().left;
      const targetPositionTop = this.targetPosition.getBoundingClientRect().top;
      const targetPositionLeft = this.targetPosition.getBoundingClientRect().left;

      root.style.setProperty("--targetPositionTop", (targetPositionTop - targetPieceTop) + "px");
      root.style.setProperty("--targetPositionLeft", (targetPositionLeft - targetPieceLeft) + "px");
      root.style.setProperty("--animationTime", this.animationTime); // Development setting

      this.targetPiece.classList.add("moveBetweenGrids");
      this.targetPiece.addEventListener("animationstart", this.movementStarts);
      this.targetPiece.addEventListener("animationend", this.movementEnds);
    });

    _movementStarts.set(this, () => {
      this.animationStarts();
    });

    _movementEnds.set(this, () => {
      this.animationEnds();
      this.addTargetPieceToTargetPosition();
      this.targetPiece.remove();
      this.resetActivation();
      this.switchTurn();
    });

    _animationStarts.set(this, () => {
      this.playerPieces.forEach(piece => piece.classList.add("notAllowed"));
      this.temporaryPositions.forEach(position => position.classList.add("notAllowed"));
      this.animationInProgress = true;
    });

    _animationEnds.set(this, () => {
      this.playerPieces.forEach(piece => piece.classList.remove("notAllowed"));
      this.temporaryPositions.forEach(piece => piece.classList.remove("notAllowed"));
      this.animationInProgress = false;
    });

    _addTargetPieceToTargetPosition.set(this, () => {
      const numberString = Helper.upperCaseFirstLetter(this.app.activePlayer.numberString);
      const targetArea = window.getComputedStyle(this.targetPosition).gridArea.split("/")[0].trim();
      const newPiece = Helper.create({
        type: "div", id: this.targetPiece.id, class: `player${numberString} piece`,
        area: targetArea,
        parent: this.app.selectors.gameboard
      });
    });

    _switchTurn.set(this, () => {
      this.switchPlayers();
      this.activatePlayer();
      this.deactivatePlayer();
      this.scrollToActivePieceContainer();
    });

    _activatePlayer.set(this, () => {
      const numberString = Helper.upperCaseFirstLetter(this.app.activePlayer.numberString);
      const piecesContainer = document.querySelector(`.player${numberString}.piecesContainer`);
      piecesContainer.classList.add("active");
    });

    _deactivatePlayer.set(this, () => {
      const numberString = Helper.upperCaseFirstLetter(this.app.deactivePlayer.numberString);
      const piecesContainer = document.querySelector(`.player${numberString}.piecesContainer`);
      piecesContainer.classList.remove("active");
    });

    _switchPlayers.set(this, () => {
      const activePlayer = this.app.activePlayer;
      const deactivePlayer = this.app.deactivePlayer;
      this.app.activePlayer = deactivePlayer;
      this.app.deactivePlayer = activePlayer;
    });

    _scrollToActivePieceContainer.set(this, () => {
      const numberString = Helper.upperCaseFirstLetter(this.app.deactivePlayer.numberString);
      const piecesContainer = document.querySelector(`.player${numberString}.piecesContainer`);
      piecesContainer.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Properties
  get app() { return _app.get(this); }
  get targetPiece() { return _targetPiece.get(this); }
  get targetPosition() { return _targetPosition.get(this); }
  get playerPieces() { return _playerPieces.get(this); }
  get animationInProgress() { return _animationInProgress.get(this); }
  get temporaryPositions() { return Array.from(document.querySelectorAll(".gameboard > .temporaryPosition")); }

  get gamePiecesForEachPlayer() { return _gamePiecesForEachPlayer.get(this); }
  get animationTime() { return _animationTime.get(this); }

  set targetPiece(value) { _targetPiece.set(this, value); }
  set targetPosition(value) { _targetPosition.set(this, value); }
  set playerPieces(value) { _playerPieces.set(this, value); }
  set animationInProgress(value) { _animationInProgress.set(this, value); }


  // Methods
  get animateMovement() { return _animateMovement.get(this); }
  get movementStarts() { return _movementStarts.get(this); }
  get movementEnds() { return _movementEnds.get(this); }
  get animationStarts() { return _animationStarts.get(this); }
  get animationEnds() { return _animationEnds.get(this); }
  get removeGameboardPositions() { return _removeGameboardPositions.get(this); }
  get removeActivation() { return _removeActivation.get(this); }
  get resetActivation() { return _resetActivation.get(this); }
  get addTargetPieceToTargetPosition() { return _addTargetPieceToTargetPosition.get(this); }
  get switchTurn() { return _switchTurn.get(this); }
  get activatePlayer() { return _activatePlayer.get(this); }
  get deactivatePlayer() { return _deactivatePlayer.get(this); }
  get switchPlayers() { return _switchPlayers.get(this); }
  get scrollToActivePieceContainer() { return _scrollToActivePieceContainer.get(this); }


  init() {
    this.app.activePlayer = this.app.players[1];
    this.app.deactivePlayer = this.app.players[0];
    this.switchTurn();
  }
}