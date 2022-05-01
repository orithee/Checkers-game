const CHECKERS_BOARD_ID = "checkers-board";
const BOARD_SIZE = 8;

const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";
const PAWN = "pawn";

let notYourTurn = document.createElement("div");
let mustEat = document.createElement("div");
let selectedPiece;

let table;
let game;
let boardData;

function initGame() {
  boardData = new BoardData();
  //   console.log(boardData);
  //   console.log(boardData.pieces);
  game = new Game(WHITE_PLAYER);
  //   console.log(game);
  createBoard();
}

function onCellClick(row, col) {
  // Remove the alert "notYourTurn":
  notYourTurn.remove();
  mustEat.remove();

  // selectedPiece - (selected in previous click) The current selected piece.
  //   (row, col)- the current click:
  if (selectedPiece !== undefined && game.tryMove(selectedPiece, row, col)) {
    selectedPiece = undefined;
    game.clearBoard();
    //TODO: checking if the next player can do somthing :
    // game.checkingIfMatte();
  } else {
    game.clearBoard();
    game.showPossibleMovesOnBoard(row, col);
  }
}

function createBoard() {
  table = document.createElement("table");
  table.id = CHECKERS_BOARD_ID;
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
    image.src = "images/" + piece.player + ".jpeg";
    image.draggable = false;
    cell.appendChild(image);
  }
}

window.addEventListener("load", initGame);
