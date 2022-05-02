const BOARD_SIZE = 8;

const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";
const PAWN = "pawn";
const QUEEN = "queen";

let notYourTurn = document.createElement("div");
let youMustEat = document.createElement("div");

let selectedPiece;
let table;
let game;
let boardData;
let doubleEating = false;

function initGame() {
  boardData = new BoardData();
  game = new Game(WHITE_PLAYER);
  createBoard();
}

function Conditions() {
  // If the game is over - exit the function:
  if (game.winner !== undefined) {
    return false;
  }
  // Remove the alerts "notYourTurn","youMustEat" :
  notYourTurn.remove();
  youMustEat.remove();
  return true;
}

function onCellClick(row, col) {
  if (!Conditions()) return;

  // selectedPiece - selected in previous click.
  // (row, col) - the current click:
  if (selectedPiece !== undefined && game.tryMove(selectedPiece, row, col)) {
    if (doubleEating === false) {
      selectedPiece = undefined;
      boardData.clearBoard();
      game.checkingIfGameOver();
    }
  } else {
    boardData.clearBoard();
    game.showPossibleMovesOnBoard(row, col);
  }
}

function createBoard() {
  table = document.createElement("table");
  document.body.appendChild(table);
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.classList = "light-cell";
      } else {
        cell.classList = "dark-cell";
        cell.addEventListener("click", () => onCellClick(row, col));
      }
    }
  }
  addImages();
}

function addImages() {
  // Add pieces images to board
  for (let piece of boardData.pieces) {
    const cell = table.rows[piece.row].cells[piece.col];
    const image = document.createElement("img");
    image.src = "images/" + piece.player + ".png";
    image.draggable = false;
    cell.appendChild(image);
  }
}

window.addEventListener("load", initGame);
