import { Game } from "./Game.js";
import { Helper } from "./Helper.js";

const _phase = new WeakMap();
const _phaseNameEstLang = new WeakMap();

const _preparePieces = new WeakMap();
const _activatePiece = new WeakMap();
const _highlightPiece = new WeakMap();
const _activateTargetPiece = new WeakMap();
const _deactivateOtherPieces = new WeakMap();
const _createGameboardPositions = new WeakMap();
// const _getSurroundingPositions = new WeakMap();
const _resetProhibitedPositions = new WeakMap();
const _movePiece = new WeakMap();


export class PhaseTwo extends Game {
  constructor(app) {
    super(app);
    _phase.set(this, "two");
    _phaseNameEstLang.set(this, "teine");


    _preparePieces.set(this, () => {
      const gameboardPieces = Array.from(this.app.selectors.gameboard.children);
      gameboardPieces.forEach(piece => {
        piece.addEventListener("click", this.activatePiece);
      });
    });

    _activatePiece.set(this, (event) => {
      const numberString = Helper.upperCaseFirstLetter(this.app.activePlayer.numberString);
      this.targetPiece = event.target;
      this.playerPieces = Array.from(document.querySelectorAll(`.gameboard > .player${numberString}.piece`));
      if (this.playerPieces.includes(this.targetPiece) && !this.animationInProgress) {
        _highlightPiece.get(this)();
      }
    });

    _highlightPiece.set(this, () => {
      if (this.targetPiece.classList.contains("active")) {
        this.resetActivation();
        this.app.selectors.playerTurnDescription.textContent = this.app.turnDescription.toActivatePiece;
      } else {
        _activateTargetPiece.get(this)();
        _deactivateOtherPieces.get(this)();
        _createGameboardPositions.get(this)();
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
      // const targetPieceArea = window.getComputedStyle(this.targetPiece).gridArea.split("/")[0].trim();
      const areas = this.getSurroundingPositions();
      areas.forEach(area => {
        if (area && !this.app.activePlayer.allProhibitedPositions.includes(area)) {
          const temporaryPosition = Helper.create({
            type: "div", class: "temporaryPosition", area,
            event: { type: "click", function: _movePiece.get(this) },
            parent: this.app.selectors.gameboard
          });
        }
      });
      // console.log("playerPieces: ", this.app.activePlayer.playerPiecePositions);
      // console.log("opponentPieces", this.app.activePlayer.opponentPiecePositions);
      // console.log("playerProhibitedPositions: ", this.app.activePlayer.prohibitedPositions);
      // console.log("allPiecePositions: ", this.app.activePlayer.allPiecePositions);
      // console.log("allProhibitedPositions: ", this.app.activePlayer.allProhibitedPositions);


      // const allPieces = this.app.activePlayer.allProhibitedPositions;
      // for (let row = 1; row <= 5; row++) {
      //   for (let column = 1; column <= 6; column++) {
      //     const area = `a${row}${column}`;
      //     if (!this.app.activePlayer.allProhibitedPositions.includes(area)) {
      //       const temporaryPosition = Helper.create({
      //         type: "div", class: "temporaryPosition", area,
      //         event: { type: "click", function: this.movePiece },
      //         parent: this.app.selectors.gameboard
      //       });
      //     }
      //   }
      // }
    });

    _movePiece.set(this, (event) => {
      this.targetPosition = event.target;
      if (!this.animationInProgress) this.animateMovement();
    });

    // _getSurroundingPositions.set(this, (targetPieceArea) => {
    //   const row = +targetPieceArea[1], column = +targetPieceArea[2];
    //   const topArea = (row > 1) ? `a${row - 1}${column}` : null;
    //   const bottomArea = (row < 5) ? `a${row + 1}${column}` : null;
    //   const leftArea = (column > 1) ? `a${row}${column - 1}` : null;
    //   const rightArea = (column < 6) ? `a${row}${column + 1}` : null;
    //   return [topArea, leftArea, bottomArea, rightArea];
    // });

    _resetProhibitedPositions.set(this, () => {
      this.app.players.forEach(player => {
        player.prohibitedPositions = [];
        player.allProhibitedPositions = player.playerPiecePositions.concat(player.opponentPiecePositions);
      });
    });

  }

  get phase() { return _phase.get(this); }

  get activatePiece() { return _activatePiece.get(this); }


  init() {
    this.app.selectors.gamePhaseDescription.textContent = `Mängu ${_phaseNameEstLang.get(this)} faas`;
    _resetProhibitedPositions.get(this)();
    _preparePieces.get(this)();
  }
}