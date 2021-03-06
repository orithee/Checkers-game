const BOARD_SIZE = 8;

const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";
const PAWN = "pawn";
const QUEEN = "queen";

const NOT_YOUR_TURN = document.createElement("div");
const YOU_MUST_EAT = document.createElement("div");
const WINNER_POPUP = document.createElement("div");
const NEW_GAME = document.createElement("button");

let doubleEating = false;
let selectedPiece;
let table;
let game;
let boardData;
let oneTimeMessage;

function onCellClick(row, col) {
  if (!game.Conditions()) return;

  // selectedPiece - selected in previous click.
  // (row, col) - the current click:
  if (selectedPiece !== undefined && game.tryMove(selectedPiece, row, col)) {
    if (doubleEating === false) {
      selectedPiece = undefined;
      boardData.clearBoard();
      boardData.checkingIfGameOver();
    }
  } else {
    boardData.clearBoard();
    game.showPossibleMovesOnBoard(row, col);
  }
}

function initGame() {
  // Create pieces:
  boardData = new BoardData();
  // Create players and a winner:
  game = new Game(WHITE_PLAYER);

  // Create a table:
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
  boardData.addImages();
}

window.addEventListener("load", initGame);
