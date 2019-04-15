import { Game } from "./Game.js";
import { Helper } from "./Helper.js";

const _phaseName = new WeakMap();

const _createPlayerPieces = new WeakMap();
const _activatePiece = new WeakMap();
const _highlightPiece = new WeakMap();
const _activateTargetPiece = new WeakMap();
const _deactivateOtherPieces = new WeakMap();
const _createGameboardPositions = new WeakMap();
const _movePiece = new WeakMap();

export class PhaseOne extends Game {
  constructor(app) {
    super(app);
    _phaseName.set(this, "one");

    _createPlayerPieces.set(this, () => {
      this.app.players.forEach(player => {
        const numberString = Helper.upperCaseFirstLetter(player.numberString);
        const piecesContainer = document.querySelector(`.player${numberString}.piecesContainer`);
        for (let pieceNumber = 1; pieceNumber <= this.gamePiecesForEachPlayer; pieceNumber++) {
          const pieceId = `p${player.number}_${pieceNumber}`;
          const gamePiece = Helper.create({
            type: "div", id: pieceId, class: "piece", text: pieceNumber, area: pieceId,
            event: { type: "click", function: _activatePiece.get(this) },
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
        _highlightPiece.get(this)();
      }
    });

    _highlightPiece.set(this, () => {
      if (this.targetPiece.classList.contains("active")) {
        this.resetActivation();
      } else {
        _activateTargetPiece.get(this)();
        _deactivateOtherPieces.get(this)();
        _createGameboardPositions.get(this)();
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
      for (let row = 1; row <= 5; row++) {
        for (let column = 1; column <= 6; column++) {
          const area = `a${row}${column}`;
          const temporaryPosition = Helper.create({
            type: "div", class: "temporaryPosition", area,
            event: { type: "click", function: _movePiece.get(this) },
            parent: this.app.selectors.gameboard
          });
        }
      }
    });

    _movePiece.set(this, (event) => {
      this.targetPosition = event.target;
      if (!this.animationInProgress) this.animateMovement();
    });
  }


  init() {
    super.init();
    _createPlayerPieces.get(this)();
  }
}