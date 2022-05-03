class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
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

  filteredMoves(moves) {
    // Get filtered moves - Return only the cells inside the board:
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

  getPawnEatingMoves() {
    // Get the possible eating moves of 'Pawn piece':
    let result = [];
    let direction = 1;
    if (this.player === BLACK_PLAYER) {
      direction = -1;
    }

    let Sides = [-1, 1];
    for (const side of Sides) {
      if (
        boardData.isEnemy(this.row + direction, this.col + side) &&
        boardData.isEmpty(this.row + direction * 2, this.col + side * 2)
      ) {
        result.push([this.row + direction * 2, this.col + side * 2]);
      }
    }
    return result;
  }

  getQueenEatingMoves() {
    // Get the possible eating moves of 'Queen piece':
    let result = [];
    let directionRow = [-1, -1, 1, 1];
    let directionCol = [-1, 1, -1, 1];

    for (let j = 0; j < directionRow.length; j++) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        const row = this.row + directionRow[j] * i;
        const col = this.col + directionCol[j] * i;
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
    return result;
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
    const directionRow = [-1, -1, 1, 1];
    const directionCol = [-1, 1, -1, 1];

    for (let j = 0; j < directionRow.length; j++) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        const row = this.row + directionRow[j] * i;
        const col = this.col + directionCol[j] * i;
        if (boardData.isEmpty(row, col)) {
          result.push([row, col]);
        } else {
          break;
        }
      }
    }
    return result;
  }

  CheckDoubleEating() {
    // This function will work even if the 'doubleEating' is of a queen and even if it is of a pawn:
    let nextEating = [];
    let directions = [-1, 1];
    for (const loopNumber1 of directions) {
      for (const loopNumber2 of directions) {
        if (
          boardData.isEnemy(this.row + loopNumber1, this.col + loopNumber2) &&
          boardData.isEmpty(
            this.row + loopNumber1 * 2,
            this.col + loopNumber2 * 2
          )
        ) {
          nextEating.push([
            this.row + loopNumber1 * 2,
            this.col + loopNumber2 * 2,
          ]);
        }
      }
    }

    // Check if he has the option to "doubleEating":
    if (nextEating[0] !== undefined) {
      let double = this.filteredMoves(nextEating);
      if (double !== undefined) {
        for (const option of double) {
          const cell = table.rows[option[0]].cells[option[1]];
          cell.classList.add("possible-move");
        }
        doubleEating = true;
        game.oneTimeExplanatoryMessage();
        return double;
      }
    }

    return undefined;
  }
}
