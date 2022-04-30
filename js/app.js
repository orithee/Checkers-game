const CHECKERS_BOARD_ID = "checkers-board";
const BOARD_SIZE = 8;
let table;

function initGame() {
  console.log("start");
  createBoard();
}

function onCellClick() {
  console.log("Cell Was clicked");
}

function createBoard() {
  console.log("createBoard");
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
  //   addImages();
}

// function addImages() {
//   // Add pieces images to board
//   for (let piece of boardData.pieces) {
//     const cell = table.rows[piece.row].cells[piece.col];
//     const image = document.createElement("img");
//     image.src = "images/" + piece.player + "/" + piece.type + ".png";
//     image.draggable = false;
//     cell.appendChild(image);
//   }
// }

window.addEventListener("load", initGame);
