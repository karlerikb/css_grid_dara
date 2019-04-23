import { Helper } from "./Helper.js";

const _gamePiecesForEachPlayer = new WeakMap();
const _animationTime = new WeakMap();

const _app = new WeakMap();
const _targetPiece = new WeakMap();
const _targetPosition = new WeakMap();
const _playerPieces = new WeakMap();
const _animationInProgress = new WeakMap();
const _piecesPositions = new WeakMap();

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
const _configureGameboardPositions = new WeakMap();
const _testPhase = new WeakMap();
const _configureGameboardMovementPositions = new WeakMap();
const _getSurroundingPositions = new WeakMap();


export class Game {
  constructor(app) {
    // Temporary development variables
    _gamePiecesForEachPlayer.set(this, 3);
    _animationTime.set(this, ".5s");

    // Properties
    _app.set(this, app);
    _animationInProgress.set(this, false);
    _piecesPositions.set(this, {});


    // Methods
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
      const root = this.app.selectors.root;

      const targetPieceTop = this.targetPiece.getBoundingClientRect().top;
      const targetPieceLeft = this.targetPiece.getBoundingClientRect().left;
      const targetPositionTop = this.targetPosition.getBoundingClientRect().top;
      const targetPositionLeft = this.targetPosition.getBoundingClientRect().left;

      const top = targetPositionTop - targetPieceTop;
      const left = targetPositionLeft - targetPieceLeft;

      root.style.setProperty("--targetPositionTop", `${top}px`);
      root.style.setProperty("--targetPositionLeft", `${left}px`);
      root.style.setProperty("--animationTime", this.animationTime); // Development setting

      this.targetPiece.classList.add("animateMovement");
      this.targetPiece.addEventListener("animationstart", this.movementStarts);
      this.targetPiece.addEventListener("animationend", this.movementEnds);
    });

    _movementStarts.set(this, () => {
      this.animationStarts();
      this.app.selectors.playerTurnDescription.textContent = this.app.turnDescription.whenMoving;
    });

    _movementEnds.set(this, () => {
      this.animationEnds();
      this.addTargetPieceToTargetPosition();
      this.targetPiece.remove();
      this.resetActivation();
      this.switchTurn();
      this.app.selectors.playerTurnDescription.textContent = this.app.turnDescription.toActivatePiece;
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
      // 
      if (this.app.activePhase === "one") this.configureGameboardPositions(targetArea);
      if (this.app.activePhase === "two") {
        _configureGameboardMovementPositions.get(this)(targetArea);
        // console.log(this.app.phases[1]);
        newPiece.addEventListener("click", this.app.phases[1].activatePiece);
      }
    });

    _configureGameboardPositions.set(this, (targetArea) => {
      this.piecesPositions[targetArea] = this.targetPiece.id;
      this.app.activePlayer.setPlayerPiecePosition(this.piecesPositions, this.app.activePhase);
      this.app.deactivePlayer.setPlayerPiecePosition(this.piecesPositions, this.app.activePhase);
    });

    _switchTurn.set(this, () => {
      this.switchPlayers();
      this.activatePlayer();
      this.deactivatePlayer();
      this.scrollToActivePieceContainer();
      this.testPhase();
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

    _testPhase.set(this, () => {
      const piecesOnTable = Object.keys(this.piecesPositions).length;
      if (piecesOnTable === this.gamePiecesForEachPlayer * 2) this.app.startPhaseTwo();
    });

    _configureGameboardMovementPositions.set(this, (targetArea) => {
      const targetPieceArea = window.getComputedStyle(this.targetPiece).gridArea.split("/")[0].trim();
      const pieceToBeMoved = this.app.activePlayer.allPiecePositions[targetPieceArea];

      this.app.activePlayer.playerPiecePositions = [];
      this.app.deactivePlayer.playerPiecePositions = [];
      this.app.activePlayer.opponentPiecePositions = [];
      this.app.deactivePlayer.opponentPiecePositions = [];
      

      this.app.activePlayer.allPiecePositions[targetArea] = pieceToBeMoved;
      delete this.app.activePlayer.allPiecePositions[targetPieceArea];

      const piecesPositions = this.app.activePlayer.allPiecePositions;
      this.app.activePlayer.setPlayerPiecePosition(piecesPositions, this.app.activePhase);
      this.app.deactivePlayer.setPlayerPiecePosition(piecesPositions, this.app.activePhase);

    });

    _getSurroundingPositions.set(this, () => {
      const targetPieceArea = window.getComputedStyle(this.targetPiece).gridArea.split("/")[0].trim();
      const row = +targetPieceArea[1], column = +targetPieceArea[2];
      const topArea = (row > 1) ? `a${row - 1}${column}` : null;
      const bottomArea = (row < 5) ? `a${row + 1}${column}` : null;
      const leftArea = (column > 1) ? `a${row}${column - 1}` : null;
      const rightArea = (column < 6) ? `a${row}${column + 1}` : null;
      return [topArea, leftArea, bottomArea, rightArea];
    });
  }

  // Properties
  get app() { return _app.get(this); }
  get targetPiece() { return _targetPiece.get(this); }
  get targetPosition() { return _targetPosition.get(this); }
  get playerPieces() { return _playerPieces.get(this); }
  get animationInProgress() { return _animationInProgress.get(this); }
  get piecesPositions() { return _piecesPositions.get(this); }
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
  get configureGameboardPositions() { return _configureGameboardPositions.get(this); }
  get testPhase() { return _testPhase.get(this); }
  get getSurroundingPositions() { return _getSurroundingPositions.get(this); }


  init() {
    this.app.activePlayer = this.app.players[1];
    this.app.deactivePlayer = this.app.players[0];
    this.switchTurn();
  }
}