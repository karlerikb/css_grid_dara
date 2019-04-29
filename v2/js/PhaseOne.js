import { Game } from "./Game.js";
import { Helper } from "./Helper.js";

const _phaseName = new WeakMap();
const _phaseNameEstLang = new WeakMap();

const _createPlayerPieces = new WeakMap();
const _activatePiece = new WeakMap();
const _highlightPiece = new WeakMap();
const _activateTargetPiece = new WeakMap();
const _deactivateOtherPieces = new WeakMap();
const _createGameboardPositions = new WeakMap();
const _movePiece = new WeakMap();
const _setDescriptions = new WeakMap();


export class PhaseOne extends Game {
  constructor(app) {
    super(app);
    _phaseName.set(this, "one");
    _phaseNameEstLang.set(this, "esimene");

    _createPlayerPieces.set(this, () => {
      this.app.players.forEach(player => {
        const numberString = Helper.upperCaseFirstLetter(player.numberString);
        const piecesContainer = document.querySelector(`.player${numberString}.piecesContainer`);
        for (let pieceNumber = 1; pieceNumber <= this.gamePiecesForEachPlayer; pieceNumber++) {
          const pieceId = `p${player.number}_${pieceNumber}`;
          const gamePiece = Helper.create({
            type: "div", id: pieceId, class: "piece", text: pieceNumber, area: pieceId,
            event: { type: "click", function: this.activatePiece },
            parent: piecesContainer
          });
        }
      });
    });

    _activatePiece.set(this, (event) => {
      const numberString = Helper.upperCaseFirstLetter(this.app.activePlayer.numberString);
      this.targetPiece = event.target;
      this.playerPieces = Array.from(document.querySelector(`.player${numberString}.piecesContainer`).children);
      if (this.playerPieces.includes(this.targetPiece) && !this.animationInProgress) {
        this.highlightPiece();
      }
    });

    _highlightPiece.set(this, () => {
      if (this.targetPiece.classList.contains("active")) {
        this.resetActivation();
        this.app.selectors.playerTurnDescription.textContent = this.app.turnDescription.toActivatePiece;
      } else {
        this.activateTargetPiece();
        this.deactivateOtherPieces();
        this.createGameboardPositions();
        this.app.selectors.playerTurnDescription.textContent = this.app.turnDescription.toSelectPosition;
      }
    });

    _activateTargetPiece.set(this, () => {
      const target = this.targetPiece.classList;
      target.add("active");
      if (target.contains("inactive")) target.remove("inactive");
    });

    _deactivateOtherPieces.set(this, () => {
      const deactivatedPieces = this.playerPieces.filter(piece => piece !== this.targetPiece);
      deactivatedPieces.forEach(piece => {
        piece.classList.add("inactive");
        if (piece.classList.contains("active") && piece !== this.targetPiece) piece.classList.remove("active");
      });
    });

    _createGameboardPositions.set(this, () => {
      this.removeGameboardPositions();
      const allPieces = this.app.activePlayer.allProhibitedPositions;
      for (let row = 1; row <= 5; row++) {
        for (let column = 1; column <= 6; column++) {
          const area = `a${row}${column}`;
          if (!this.app.activePlayer.allProhibitedPositions.includes(area)) {
            const temporaryPosition = Helper.create({
              type: "div", class: "temporaryPosition", area,
              event: { type: "click", function: this.movePiece },
              parent: this.app.selectors.gameboard
            });
          }
        }
      }
    });

    _movePiece.set(this, (event) => {
      this.targetPosition = event.target;
      if (!this.animationInProgress) this.animateMovement();
    });

    _setDescriptions.set(this, () => {
      const gamePhase = this.app.selectors.gamePhaseDescription;
      const playerTurn = this.app.selectors.playerTurn;
      const playerTurnDescription = this.app.selectors.playerTurnDescription;
      gamePhase.textContent = `Mängu ${_phaseNameEstLang.get(this)} faas`;
      playerTurn.textContent = `${this.app.activePlayer.name} kord`;
      playerTurnDescription.textContent = this.app.turnDescription.toActivatePiece;
    });
  }


  // Methods
  get createPlayerPieces() { return _createPlayerPieces.get(this); }
  get activatePiece() { return _activatePiece.get(this); }
  get highlightPiece() { return _highlightPiece.get(this); }
  get activateTargetPiece() { return _activateTargetPiece.get(this); }
  get deactivateOtherPieces() { return _deactivateOtherPieces.get(this); }
  get createGameboardPositions() { return _createGameboardPositions.get(this); }
  get movePiece() { return _movePiece.get(this); }


  init() {
    super.init();
    this.createPlayerPieces();
    _setDescriptions.get(this)();
  }
}