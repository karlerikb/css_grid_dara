const _playerNumber = new WeakMap();
const _playerNumberString = new WeakMap();
const _playerName = new WeakMap();

const _playerPiecePositions = new WeakMap();
const _opponentPiecePositions = new WeakMap();
const _prohibitedPositions = new WeakMap();
const _allPiecePositions = new WeakMap();
const _allProhibitedPositions = new WeakMap();

const _setPlayerPiecePosition = new WeakMap();
const _getPlayerPieces = new WeakMap();
const _searchForProhibitedPositions = new WeakMap();
const _searchHorizontally = new WeakMap();
const _searchVertically = new WeakMap();
const _divideReachIntoThrees = new WeakMap();
const _getReachAreasHorizontally = new WeakMap();
const _getReachAreasVertically = new WeakMap();
const _getReachValidation = new WeakMap();
const _determineProhibitedPosition = new WeakMap();
const _combineProhibitedPositions = new WeakMap();


export class Player {
  constructor(number, numberString, name) {
    // Properties
    _playerNumber.set(this, number);
    _playerNumberString.set(this, numberString);
    _playerName.set(this, name);
    _playerPiecePositions.set(this, []);
    _opponentPiecePositions.set(this, []);
    _prohibitedPositions.set(this, []);
    _allProhibitedPositions.set(this, []);

    // Methods
    _setPlayerPiecePosition.set(this, (piecesPositions) => {
      this.allPiecePositions = piecesPositions;
      this.getPlayerPieces();
      this.searchForProhibitedPositions();
    });

    _getPlayerPieces.set(this, () => {
      for (let position in this.allPiecePositions) {
        const piecePlayerId = +this.allPiecePositions[position][1];
        if (piecePlayerId === this.number && !this.playerPiecePositions.includes(position)) {
          this.playerPiecePositions.push(position);
        } else {
          this.opponentPiecePositions.push(position);
        }
      }
    });
    
    _searchForProhibitedPositions.set(this, () => {
      this.searchHorizontally();
      this.searchVertically();
      this.combineProhibitedPositions();
    });

    _combineProhibitedPositions.set(this, () => {
      const player = this.playerPiecePositions;
      const opponent = this.opponentPiecePositions;
      const prohibited = this.prohibitedPositions;
      this.allProhibitedPositions = player.concat(opponent, prohibited);
    });
    
    _searchHorizontally.set(this, () => {
      this.playerPiecePositions.forEach(position => {
        const reach = this.getReachAreasHorizontally(position);
        const reachValidation = this.getReachValidation(reach);
        const validCount = reachValidation.reduce((areas, available) => areas + available);
        if (validCount > 2) this.divideReachIntoThrees(reach);
      });
    });

    _searchVertically.set(this, () => {
      this.playerPiecePositions.forEach(position => {
        const reach = this.getReachAreasVertically(position);
        const reachValidation = this.getReachValidation(reach);
        const validCount = reachValidation.reduce((areas, available) => areas + available);
        if (validCount > 2) this.divideReachIntoThrees(reach);
      });
    });

    _getReachAreasHorizontally.set(this, (position) => {
      const row = +position[1], column = +position[2];
      const reach = [
        (column < 3) ? null : `a${row}${column - 2}`,
        (column < 2) ? null : `a${row}${column - 1}`,
        position,
        (column > 5) ? null : `a${row}${column + 1}`,
        (column > 4) ? null : `a${row}${column + 2}`
      ];
      return reach;
    });

    _getReachAreasVertically.set(this, (position) => {
      const row = +position[1], column = +position[2];
      const reach = [
        (row < 3) ? null : `a${row - 2}${column}`,
        (row < 2) ? null : `a${row - 1}${column}`,
        position,
        (row > 5) ? null : `a${row + 1}${column}`,
        (row > 4) ? null : `a${row + 2}${column}`
      ];
      return reach;
    });

    _getReachValidation.set(this, (reach) => {
      const allPieces = Object.keys(this.allPiecePositions);
      const playerPieces = this.playerPiecePositions;
      const reachValidation = reach.map(position => {
        if (!position || allPieces.includes(position) && !playerPieces.includes(position)) return false;
        else return true;
      });
      return reachValidation;
    });

    _divideReachIntoThrees.set(this, (reach) => {
      for (let i = 0; i < 3; i++) {
        const threeReachPositions = reach.slice(i, i + 3);
        const threePositions = threeReachPositions.map(position => {
          return (this.playerPiecePositions.includes(position) ? true : false);
        });
        const validCount = threePositions.reduce((areas, available) => areas + available);
        if (validCount === 2) this.determineProhibitedPosition(threeReachPositions);
      }
    });

    _determineProhibitedPosition.set(this, (threeReachPositions) => {
      const player = this.playerPiecePositions;
      const opponent = this.opponentPiecePositions;
      const prohibited = this.prohibitedPositions;
      threeReachPositions.forEach(position => {
        if (position && !player.includes(position) && !opponent.includes(position) && !prohibited.includes(position)) {
          this.prohibitedPositions.push(position);
        }
      });
    });
  }

  // Properties
  get number() { return _playerNumber.get(this); }
  get numberString() { return _playerNumberString.get(this); }
  get name() { return _playerName.get(this); }
  get playerPiecePositions() { return _playerPiecePositions.get(this); }
  get opponentPiecePositions() { return _opponentPiecePositions.get(this); }
  get prohibitedPositions() { return _prohibitedPositions.get(this); }
  get allPiecePositions() { return _allPiecePositions.get(this); }
  get allProhibitedPositions() { return _allProhibitedPositions.get(this); }

  set allPiecePositions(value) { _allPiecePositions.set(this, value); }
  set allProhibitedPositions(value) { _allProhibitedPositions.set(this, value); }
  


  // Methods
  get setPlayerPiecePosition() { return _setPlayerPiecePosition.get(this); }
  get getPlayerPieces() { return _getPlayerPieces.get(this); }
  get searchForProhibitedPositions() { return _searchForProhibitedPositions.get(this); }
  get searchHorizontally() { return _searchHorizontally.get(this); }
  get searchVertically() { return _searchVertically.get(this); }
  get divideReachIntoThrees() { return _divideReachIntoThrees.get(this); }
  get getReachAreasHorizontally() { return _getReachAreasHorizontally.get(this); }
  get getReachAreasVertically() { return _getReachAreasVertically.get(this); }
  get getReachValidation() { return _getReachValidation.get(this); }
  get determineProhibitedPosition() { return _determineProhibitedPosition.get(this); }
  get combineProhibitedPositions() { return _combineProhibitedPositions.get(this); }
}