import { Configuration } from "../conf/configuration";
import { Helper } from "../conf/helper";

export class Hints {
  private static _instance: Hints;
  private conf: Configuration = Configuration.instance;
  private gameTurnDescriptions = {
    waitingTurn: "Oodatakse mängukorda...",
    waitingPieceActivation: "Vali mängunupp...",
    waitingPositionSelection: "Vali positsioon mängulaual...",
    movingPiece: "Nuppu liigutatakse...",
    waitingThreeInRowSelection: "Vali üks kolmestest ridadest...",
    removeOpponentPiece: "Tekitasid kolmese rea! Eemalda vastaselt üks mängunupp...",
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
    noFourInRow: {
      active: false,
      text: "Nupu liigutamisel <strong>ei tohi</strong> tekkida neljast rida"
    }
  }

  private constructor() {
  }

  switchPhaseInHints(): void {
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


  private setRemovingFromThreeInRowNotAllowedDetail(): void {
    if (this.conf.inactivePlayer.threeInRows.length > 0) {
      this.showAdditionalDetails();
      this.additionalDetails.removingFromThreeInRowNotAllowed.active = true;
      this.configureAdditionalDetails();
    } else {
      this.resetAdditionalDetails();
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
  public static get instance(): Hints {
    if (!Hints._instance) {
      Hints._instance = new Hints();
    }
    return Hints._instance;
  }
}