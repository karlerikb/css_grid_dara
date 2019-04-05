

const menu = document.querySelector(".menu");
const openMenuButton = document.querySelector(".openMenuButton");
const closeMenuButton = document.querySelector(".closeMenuButton");
const playerOneTitle = document.querySelector(".playerOneTitle");
const playerTwoTitle = document.querySelector(".playerTwoTitle");
const gameMenuList = document.querySelector(".gameMenuList");

setDefaultGameMenuSettings();

openMenuButton.addEventListener("click", openMenu);
closeMenuButton.addEventListener("click", closeMenu);

function openMenu() {
  openMenuButton.classList.add("removed");
  closeMenuButton.classList.remove("removed");
  menu.classList.remove("removed");
  playerOneTitle.classList.remove("removed");
  playerTwoTitle.classList.remove("removed");
  gameMenuList.classList.remove("removed");
}

function closeMenu() {
  openMenuButton.classList.remove("removed");
  closeMenuButton.classList.add("removed");
  menu.classList.add("removed");
  playerOneTitle.classList.add("removed");
  playerTwoTitle.classList.add("removed");
  gameMenuList.classList.add("removed");
}

function setDefaultGameMenuSettings() {
  if (openMenuButton.classList.contains("removed")) openMenuButton.classList.remove("removed");
  if (!closeMenuButton.classList.contains("removed")) closeMenuButton.classList.add("removed");
  if (!menu.classList.contains("removed")) menu.classList.add("removed");
  if (!playerOneTitle.classList.contains("removed")) playerOneTitle.classList.add("removed");
  if (!playerTwoTitle.classList.contains("removed")) playerTwoTitle.classList.add("removed");
  if (!gameMenuList.classList.contains("removed")) gameMenuList.classList.add("removed");
}

