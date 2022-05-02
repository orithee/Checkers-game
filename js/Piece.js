class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }

  filteredMoves(moves) {
    // Get filtered absolute moves:
    let filteredMoves = [];
    for (const absoluteMove of moves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (
        absoluteRow >= 0 &&
        absoluteRow <= 7 &&
        absoluteCol >= 0 &&
        absoluteCol <= 7
      ) {
        filteredMoves.push(absoluteMove);
      }
    }
    return filteredMoves;
  }

  getEatingMoves() {
    // Get the possible eating moves:
    let moves;
    if (this.type === PAWN) {
      moves = this.getPawnEatingMoves();
    } else {
      moves = this.getQueenEatingMoves();
    }
    return this.filteredMoves(moves);
  }

  getQueenEatingMoves() {
    // Get the possible eating moves of 'Queen piece':
    let result = [];
    let directionRow = [-1, -1, 1, 1];
    let directionCol = [-1, 1, -1, 1];

    for (let j = 0; j < directionRow.length; j++) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        let row = this.row + directionRow[j] * i;
        let col = this.col + directionCol[j] * i;
        if (!boardData.isEmpty(row, col)) {
          if (
            boardData.isEnemy(row, col) &&
            boardData.isEmpty(row + directionRow[j], col + directionCol[j])
          ) {
            result.push([row + directionRow[j], col + directionCol[j]]);
          }
          break;
        }
      }
    }
    console.log(result);
    return result;
  }

  getPawnEatingMoves() {
    // Get the possible eating moves of 'Pawn piece':
    let result = [];
    let direction = 1;
    if (this.player === BLACK_PLAYER) {
      direction = -1;
    }

    let Sides = [-1, 1];
    for (let side of Sides) {
      if (
        boardData.isEnemy(this.row + direction, this.col + side) &&
        boardData.isEmpty(this.row + direction * 2, this.col + side * 2)
      ) {
        result.push([this.row + direction * 2, this.col + side * 2]);
      }
    }
    return result;
  }

  CheckDoubleEating(cell) {
    // This function will work even if the 'doubleEating' is of a queen and even if it is of a pawn:
    let nextEating = [];
    let directions = [-1, 1];
    for (let numberLoop1 of directions) {
      for (let numberLoop2 of directions) {
        if (
          boardData.isEnemy(cell[0] + numberLoop1, cell[1] + numberLoop2) &&
          boardData.isEmpty(
            cell[0] + numberLoop1 * 2,
            cell[1] + numberLoop2 * 2
          )
        ) {
          nextEating.push([
            cell[0] + numberLoop1 * 2,
            cell[1] + numberLoop2 * 2,
          ]);
        }
      }
    }
    return nextEating;
  }

  getNormaleMoves() {
    // Get the possible normal moves :
    let moves;

    if (this.type === PAWN) {
      moves = this.getPawnNormalMoves();
    } else {
      moves = this.getQueenNormalMoves();
    }
    return this.filteredMoves(moves);
  }

  getPawnNormalMoves() {
    // Get the possible normal moves of 'Pawn piece':
    let result = [];
    let direction = 1;
    if (this.player === BLACK_PLAYER) {
      direction = -1;
    }

    if (boardData.isEmpty(this.row + direction, this.col + -1)) {
      result.push([this.row + direction, this.col + -1]);
    }
    if (boardData.isEmpty(this.row + direction, this.col + 1)) {
      result.push([this.row + direction, this.col + 1]);
    }

    return result;
  }

  getQueenNormalMoves() {
    // Get the possible normal moves of 'Queen piece':
    let result = [];
    let directionRow = [-1, -1, 1, 1];
    let directionCol = [-1, 1, -1, 1];

    for (let j = 0; j < directionRow.length; j++) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        let row = this.row + directionRow[j] * i;
        let col = this.col + directionCol[j] * i;
        if (boardData.isEmpty(row, col)) {
          result.push([row, col]);
        } else if (!boardData.isEmpty(row, col)) {
          break;
        }
      }
    }
    return result;
  }
}
