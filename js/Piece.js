class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }

  filteredMoves(moves) {
    // Get filtered absolute moves
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
    let moves;

    if (this.type === PAWN) {
      moves = this.getPawnEatingMoves();
    }
    if (this.type === QUEEN) {
      moves = this.getQueenEatingMoves();
    }

    let basicMoveEating = this.filteredMoves(moves);

    // Add double eating( if availaible)
    // if (basicMoveEating[0] !== undefined) {
    //   let doubleEating = this.CheckDoubleEating(basicMoveEating[0]);
    //   if (doubleEating !== undefined) {
    //     doubleEating = this.filteredMoves([doubleEating]);
    //     // console.log(doubleEating);
    //   }
    //   if (doubleEating !== undefined) {
    //     basicMoveEating.push(doubleEating[0]);
    //   }
    // }
    // console.log(basicMoveEating);
    return basicMoveEating;
  }

  getQueenEatingMoves() {
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

    // TODO: add function that take the results and check if there is double eating
    // TODO: if its availaible - add to 'result array' + keep it in new array seperately
    // TODO: declare a global variable like 'let doubleEating = false'.
    // TODO: if doubleEating is availaible change it to 'true' and use it after in the try move.
    // TODO: add this functionality to the queen.
    // console.log(result);
    return result;
  }

  CheckDoubleEating(cell) {
    let nextEating = [];
    let directions = [-1, 1];
    for (let number of directions) {
      for (let revere of directions) {
        if (
          boardData.isEnemy(cell[0] + number, cell[1] + revere) &&
          boardData.isEmpty(cell[0] + number * 2, cell[1] + revere * 2)
        ) {
          nextEating.push([cell[0] + number * 2, cell[1] + revere * 2]);
        }
      }
    }
    // doubleStep = [cell, nextEating[0]];
    // console.log(doubleStep);
    console.log(nextEating);
    return nextEating;
  }

  getNormaleMoves() {
    // TODO: add the Queen steps.
    // Find the possibleMoves:
    let moves;

    if (this.type === PAWN) {
      moves = this.getPawnNormalMoves();
    }
    if (this.type === QUEEN) {
      moves = this.getQueenNormalMoves();
    }
    return this.filteredMoves(moves);
  }

  getPawnNormalMoves() {
    //   TODO: checking if he can eat some piece. if he can - exsit the function.
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
    console.log(result);
    return result;
  }
}
