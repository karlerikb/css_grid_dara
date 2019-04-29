// Elements
const gameContainerElement = document.querySelector(".gameContainer");


// Menu Functions
const openMenu_2 = function() {
  createMenuButton("close");
  createMenuElement();
}

const closeMenu_2 = function() {
  createMenuButton("open");
  const menuElement = document.querySelector(".menu");
  if (menuElement) removeMenuElement(menuElement);
}

// Variables
const players = ["one", "two"];
const playersEstLang = ["Mängija 1", "Mängija 2"];

const menuOptions = ["resume", "exit"];
const menuOptionsEstLang = ["Jätka mängu", "Välju mängust"];

const menuButtons = ["open", "close"];
const menuButtonIcons = ["fas fa-bars", "fas fa-times"];
const menuButtonFunctions = [openMenu_2, closeMenu_2];



// Initializing UI
function initUI() {
  createMenuButton("open");
}

initUI();



// Game Menu Button Functionality

function createMenuButton(type) {
  const index = menuButtons.findIndex(button => button === type);
  createMenuButtonElement(type, index);
  toggleMenuButton(type);
}

function createMenuButtonElement(type, index) {
  const menuButtonElement = document.createElement("div");
  menuButtonElement.className = `${type}MenuButton`;
  menuButtonElement.addEventListener("click", menuButtonFunctions[index]);
  gameContainerElement.appendChild(menuButtonElement);
  createMenuButtonIconElement(menuButtonElement, index);
}

function createMenuButtonIconElement(menuButtonElement, index) {
  const menuButtonIconElement = document.createElement("i");
  menuButtonIconElement.className = menuButtonIcons[index];
  menuButtonElement.appendChild(menuButtonIconElement);
}

function toggleMenuButton(type) {
  const buttonToBeRemoved = menuButtons.filter(button => button !== type);
  const buttonElementToBeRemoved = document.querySelector(`.${buttonToBeRemoved}MenuButton`);
  if (buttonElementToBeRemoved) buttonElementToBeRemoved.remove();
}



// Game Menu Functionality

function createMenuElement() {
  const menuElement = document.createElement("div");
  menuElement.className = "menu";
  gameContainerElement.appendChild(menuElement);
  createPlayerTitleElements(menuElement);
  createGameMenuListElement(menuElement);
}

function createPlayerTitleElements(menuElement) {
  players.forEach((player, number) => {
    const playerNumberString = upperCaseFirstLetter(player);
    const playerTitleElement = document.createElement("div");
    playerTitleElement.className = `player${playerNumberString}Title`;
    playerTitleElement.textContent = playersEstLang[number];
    menuElement.appendChild(playerTitleElement);
  });
}

function createGameMenuListElement(menuElement) {
  const gameMenuListElement = document.createElement("ul");
  gameMenuListElement.className = "gameMenuList";
  menuElement.appendChild(gameMenuListElement);
  createGameMenuListItemElements(gameMenuListElement);
}

function createGameMenuListItemElements(gameMenuListElement) {
  menuOptions.forEach((option, index) => {
    const gameMenuListItemElement = document.createElement("li");
    gameMenuListItemElement.className = option;
    gameMenuListItemElement.textContent = menuOptionsEstLang[index];
    gameMenuListElement.appendChild(gameMenuListItemElement);
  }); 
}

function removeMenuElement(menuElement) {
  menuElement.remove();
}



// Helper Functions

function upperCaseFirstLetter(string) {
  const firstLetter = string.charAt(0).toUpperCase();
  if (string.length === 1) {
    return firstLetter;

  } else if (string.length > 1) {
    const restOfTheString = string.slice(1);
    return firstLetter + restOfTheString;
    
  } else {
    return "";
  }
}