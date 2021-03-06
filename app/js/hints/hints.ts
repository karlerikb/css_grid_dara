import { Configuration } from "../conf/configuration";
import { Helper } from "../conf/helper";

export class Hints {
  private static _instance: Hints | null;
  private conf: Configuration = Configuration.instance;

  private gameTurnDescriptions = {
    waitingTurn: "Oodatakse mängukorda...",
    waitingPieceActivation: "Vali mängunupp...",
    waitingPositionSelection: "Vali positsioon mängulaual...",
    noPositionAvailable: "Selle nupuga käia ei saa, aktiveeri mõni teine mängunupp...",
    movingPiece: "Nuppu liigutatakse...",
    waitingThreeInRowSelection: "Vali üks kolmestest ridadest...",
    removeOpponentPiece: "Tekitasid kolmese rea! Eemalda vastaselt üks mängunupp...",
    winMessage: "<strong>Tubli!</strong> Võitsid mängu!",
    loseMessage: "Proovi uuesti järgmises mängus..."
  };

  private additionalDetails = {
    pieceChangeAllowed: {
      active: false,
      text: "Aktiveeritud mängunuppu <strong>saab</strong> vahetada või deaktiveerida"
    },
    noThreeInRow: {
      active: false,
      text: "Nupu paigutamisel lauale <strong>ei tohi</strong> tekkida kolmest rida"
    },
    lastMoveNotAllowed: {
      active: false,
      text: "Viimasena liigutatud nuppu <strong>ei saa</strong> liigutada tagasi positsioonile, kus oldi eelmise mängukorra ajal"
    },
    removingFromThreeInRowNotAllowed: {
      active: false,
      text: "Mängunuppu <strong>ei saa</strong> eemaldada vastase kolmesest reast"
    },
    removingFromThreeInRowIsAllowed: {
      active: false,
      text: "Erandkorras <strong>saab</strong> mängunupu eemaldada vastase kolmesest reast!"
    },
    noFourInRow: {
      active: false,
      text: "Nupu liigutamisel <strong>ei tohi</strong> tekkida neljast rida (kolmese rea nupp läheb arvesse...)"
    },
    piecesAmount: {
      active: false,
      text: "Vastasel on vähem kui kolm mängunuppu, ehk vastane enam kolmest rida moodustada ei saa"
    },
    noPieceCanMove: {
      active: false,
      text: "Vastane ei saa ühegi nupuga liikuda, ehk vastane kolmest rida moodustada ei saa"
    }
  }

  private lastMoveValidation: number[] = [];
  private fourInRowValidation: number[] = [];
  private noPositionsAvailableValidation: number[] = [];


  private constructor() {
    this.init();
  }

  setWinScenarioInHints(scenario: string): void {
    (<HTMLElement>document.querySelector(this.conf.selectors.gamePhase)).innerHTML = "<strong>Mäng on läbi!</strong>";
    this.activePlayerTurnDescription.innerHTML = this.gameTurnDescriptions.winMessage;
    this.inactivePlayerTurnDescription.textContent = this.gameTurnDescriptions.loseMessage;
    if (this.conf.activePlayer.numberString === "one") {
      this.activePlayerInHints.innerHTML = `<span class="trophy"><i class="fas fa-trophy"></i></span> ${this.conf.activePlayer.name}`;
    }
    if (this.conf.activePlayer.numberString === "two") {
      this.activePlayerInHints.innerHTML = `${this.conf.activePlayer.name} <span class="trophy"><i class="fas fa-trophy"></i></span> `;
    }
    this.resetAdditionalDetails();
    this.showAdditionalDetails();
    if (scenario === "piecesAmount") {
      this.additionalDetails.piecesAmount.active = true;
      this.configureAdditionalDetails();
    } else {
      this.additionalDetails.noPieceCanMove.active = true;
      this.configureAdditionalDetails();
    }
  }

  switchPhaseInHints(): void {
    if (!this.gamePhaseInHints.innerHTML) {
      this.gamePhaseInHints.innerHTML = `Käimas on mängu <strong class="currentPhase"></strong> faas`;
    }
    this.phaseInHints.textContent = (this.conf.activePhase.name === "one") ? "esimene" : "teine";
  }

  setDefaultHints(): void {
    this.setPlayerNamesInHints();
    this.initializePlayersTurnDescriptions();
    this.resetAllAdditionalDetails();
    this.resetAdditionalDetails();
    this.switchPhaseInHints();
  }

  setPieceActivationHints(): void {
    this.activePlayerTurnDescription.textContent = this.gameTurnDescriptions.waitingPositionSelection;
    this.showAdditionalDetails();
    this.setPieceChangeAllowedDetail();
  }

  setPieceMovingHints(): void {
    this.activePlayerTurnDescription.textContent = this.gameTurnDescriptions.movingPiece;
    this.resetAllAdditionalDetails();
    this.resetAdditionalDetails();
  }

  setPieceRemovalHints(): void {
    this.activePlayerTurnDescription.textContent = this.gameTurnDescriptions.removeOpponentPiece;
    this.resetAdditionalDetails();
    this.setRemovingFromThreeInRowNotAllowedDetail();
  }

  setWaitingThreeInRowSelectionHints(): void {
    this.activePlayerTurnDescription.textContent = this.gameTurnDescriptions.waitingThreeInRowSelection;
    this.resetAdditionalDetails();
  }

  findLastMoveValidation(lastMoveFlag: boolean): void {
    if (lastMoveFlag) {
      this.lastMoveValidation.push(1);
    } else {
      this.lastMoveValidation.push(0);
    }
  }

  findLastMoveValidCount(): void {
    if (this.lastMoveValidation.length > 0) {
      const validCount: number = this.lastMoveValidation.reduce((count, valid) => count + valid);
      if (validCount > 0) {
        this.setLastMoveNotAllowedDetail();
      } else {
        this.removeLastMoveNotAllowedDetail();
      }
      this.lastMoveValidation = [];
    }
  }

  findFourInRowValidation(fourInRowFlag: boolean): void {
    if (fourInRowFlag) {
      this.fourInRowValidation.push(1);
    } else {
      this.fourInRowValidation.push(0);
    }
  }

  findFourInRowValidCount(): void {
    if (this.fourInRowValidation.length > 0) {
      const validCount: number = this.fourInRowValidation.reduce((count, valid) => count + valid);
      if (validCount > 0) {
        this.setNoFourInRowAllowedDetail();
      } else {
        this.removeNoFourInRowAllowedDetail();
      }
      this.fourInRowValidation = [];
    }
  }

  findNoPositionsAvailableValidation(noPositionsFlag: boolean): void {
    if (noPositionsFlag) {
      this.noPositionsAvailableValidation.push(1);
    }
  }

  findNoPositionsAvailableValidCount(): void {
    if (this.noPositionsAvailableValidation.length > 0) {
      const validCount: number = this.noPositionsAvailableValidation.reduce((count, valid) => count + valid);
      if (validCount === 4) {
        this.setNoPieceAvailableHints();
      } else {
        this.setPieceActivationHints();
      }
      this.noPositionsAvailableValidation = [];
    }
  }

  setNoThreeInRowAllowedDetail(): void {
    if (this.conf.activePhase.name === "one") {
      this.additionalDetails.noThreeInRow.active = true;
      this.configureAdditionalDetails();
    }
  }

  setLastMoveNotAllowedDetail(): void {
    this.additionalDetails.lastMoveNotAllowed.active = true;
    this.configureAdditionalDetails();
  }

  removeLastMoveNotAllowedDetail(): void {
    this.additionalDetails.lastMoveNotAllowed.active = false;
    this.configureAdditionalDetails();
  }

  setNoFourInRowAllowedDetail(): void {
    this.additionalDetails.noFourInRow.active = true;
    this.configureAdditionalDetails();
  }

  removeNoFourInRowAllowedDetail(): void {
    this.additionalDetails.noFourInRow.active = false;
    this.configureAdditionalDetails();
  }

  reset(): void {
    Hints._instance = null;
  }

  private init(): void {
    this.createHintsContainerElements();
  }

  private createHintsContainerElements(): void {
    const hintsContainer = <HTMLElement>document.querySelector(`.${this.conf.classes.hintsContainer}`);
    const paragraphElements: string[][] = [
      [this.conf.classes.playerInHints, this.conf.classes.playerOne],
      [this.conf.classes.playerInHints, this.conf.classes.playerTwo],
      [this.conf.classes.gamePhase],
      [this.conf.classes.turnInHints, this.conf.classes.playerOne],
      [this.conf.classes.turnInHints, this.conf.classes.playerTwo],
    ];
    paragraphElements.forEach(classes => {
      Helper.create({
        type: "p", class: classes.join(" "),
        parent: hintsContainer
      });
    });
    Helper.create({
      type: "div", class: this.conf.classes.additionalDetails,
      parent: hintsContainer
    });
  }

  private setNoPieceAvailableHints(): void {
    this.activePlayerTurnDescription.textContent = this.gameTurnDescriptions.noPositionAvailable;
    this.showAdditionalDetails();
    this.setPieceChangeAllowedDetail();
  }

  private setRemovingFromThreeInRowNotAllowedDetail(): void {
    let piecesNotInRows: number = 0;
    this.conf.inactivePlayer.pieces.forEach(piece => {
      if (!piece.partOfThreeInRow) {
        piecesNotInRows++;
      }
    });
    this.showAdditionalDetails();
    if (this.conf.inactivePlayer.threeInRows.length > 0 && piecesNotInRows > 0) {
      this.additionalDetails.removingFromThreeInRowNotAllowed.active = true;
      this.configureAdditionalDetails();
    } else if (this.conf.inactivePlayer.threeInRows.length > 0 && piecesNotInRows === 0) {
      this.additionalDetails.removingFromThreeInRowNotAllowed.active = false;
      this.additionalDetails.removingFromThreeInRowIsAllowed.active = true;
      this.configureAdditionalDetails();
    } else {
      this.resetAdditionalDetails();
    }
  }

  private setPieceChangeAllowedDetail(): void {
    this.additionalDetails.pieceChangeAllowed.active = true;
    this.configureAdditionalDetails();
  }

  private showAdditionalDetails(): void {
    this.additionalDetailsInHints.classList.remove(this.conf.classes.hidden);
    this.additionalDetailsInHints.classList.add(this.activePlayerClass);
  }

  private resetAdditionalDetails(): void {
    this.additionalDetailsInHints.classList.add(this.conf.classes.hidden);
    this.additionalDetailsInHints.classList.remove(this.activePlayerClass, this.inactivePlayerClass);
    this.removeAdditionalDetails();
  }

  private resetAllAdditionalDetails(): void {
    for (let detail in this.additionalDetails) {
      this.additionalDetails[detail].active = false;
    }
  }

  private removeAdditionalDetails(): void {
    for (let detail in this.additionalDetails) {
      const detailElement = document.querySelector(`.${this.conf.classes[detail]}`);
      if (detailElement && !this.additionalDetails[detail].active) {
        detailElement.remove();
      }
    }
  }

  private createAdditionalDetails(): void {
    for (let detail in this.additionalDetails) {
      const detailElement = document.querySelector(`.${this.conf.classes[detail]}`);
      if (this.additionalDetails[detail].active && !detailElement) {
        Helper.create({
          type: "p", class: `${this.conf.classes.detail} ${this.conf.classes[detail]}`,
          HTML: this.additionalDetails[detail].text,
          parent: this.additionalDetailsInHints
        });
      }
    }
  }

  private configureAdditionalDetails(): void {
    this.removeAdditionalDetails();
    this.createAdditionalDetails();
  }

  private setPlayerNamesInHints(): void {
    this.activePlayerName();
    this.inactivePlayerName();
  }

  private activePlayerName(): void {
    if (this.activePlayerInHints.textContent !== this.conf.activePlayer.name) {
      this.activePlayerInHints.textContent = this.conf.activePlayer.name;
    }
    this.activePlayerInHints.classList.add(this.conf.classes.activeContainer);
  }

  private inactivePlayerName(): void {
    if (this.inactivePlayerInHints.textContent !== this.conf.inactivePlayer.name) {
      this.inactivePlayerInHints.textContent = this.conf.inactivePlayer.name;
    }
    this.inactivePlayerInHints.classList.remove(this.conf.classes.activeContainer);
  }

  private initializePlayersTurnDescriptions(): void {
    this.activePlayerDefaultTurnDescription();
    this.inactivePlayerDefaultTurnDescription();
  }

  private activePlayerDefaultTurnDescription(): void {
    this.activePlayerTurnDescription.textContent = this.gameTurnDescriptions.waitingPieceActivation;
    this.activePlayerTurnDescription.classList.add(this.conf.classes.activeContainer);
  }

  private inactivePlayerDefaultTurnDescription(): void {
    this.inactivePlayerTurnDescription.textContent = this.gameTurnDescriptions.waitingTurn;
    this.inactivePlayerTurnDescription.classList.remove(this.conf.classes.activeContainer);
  }

  private get activePlayerTurnDescription(): HTMLElement {
    return <HTMLElement>document.querySelector(
      this.conf.selectors[`player${this.conf.activePlayer.numberStringUpperCase}TurnInHints`]
    );
  }
  private get inactivePlayerTurnDescription(): HTMLElement {
    return <HTMLElement>document.querySelector(
      this.conf.selectors[`player${this.conf.inactivePlayer.numberStringUpperCase}TurnInHints`]
    );
  }
  private get activePlayerInHints(): HTMLElement {
    return <HTMLElement>document.querySelector(
      this.conf.selectors[`player${this.conf.activePlayer.numberStringUpperCase}InHints`]
    );
  }
  private get inactivePlayerInHints(): HTMLElement {
    return <HTMLElement>document.querySelector(
      this.conf.selectors[`player${this.conf.inactivePlayer.numberStringUpperCase}InHints`]
    );
  }
  private get additionalDetailsInHints(): HTMLElement {
    return <HTMLElement>document.querySelector(this.conf.selectors.detailsInHints);
  }
  private get activePlayerClass(): string {
    return this.conf.classes[`player${this.conf.activePlayer.numberStringUpperCase}`];
  }
  private get inactivePlayerClass(): string {
    return this.conf.classes[`player${this.conf.inactivePlayer.numberStringUpperCase}`];
  }
  private get phaseInHints(): HTMLElement {
    return <HTMLElement>document.querySelector(this.conf.selectors.gamePhaseName);
  }
  private get gamePhaseInHints(): HTMLElement {
    return <HTMLElement>document.querySelector(this.conf.selectors.gamePhase);
  }
  public static get instance(): Hints {
    if (!Hints._instance) {
      Hints._instance = new Hints();
    }
    return Hints._instance;
  }
}