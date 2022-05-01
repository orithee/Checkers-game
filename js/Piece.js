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
    // TODO: add the Queen steps + think about the eating on the try function...
    let moves;

    if (this.type === PAWN) {
      moves = this.getPawnEatingMoves();
    }
    if (this.type === KING) {
      moves = this.getKingEatingMoves();
    }
    return this.filteredMoves(moves);
  }

  getKingEatingMoves() {
    let result = [];
    let directionRow = [-1, -1, 1, 1];
    let directionCol = [-1, 1, -1, 1];

    for (let j = 0; j < directionRow.length; j++) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        let row = this.row + directionRow[j] * i;
        let col = this.col + directionCol[j] * i;
        if (boardData.isEmpty(row, col)) {
        } else {
          if (boardData.isEnemy(row, col)) {
            result.push([
              this.row + directionRow[j] * i + directionRow[j],
              this.col + directionCol[j] * i + directionCol[j],
            ]);
            break;
          }
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

    if (
      !boardData.isEmpty(this.row + direction, this.col - 1) &&
      boardData.isEnemy(this.row + direction, this.col - 1) &&
      boardData.isEmpty(this.row + direction * 2, this.col - 1 * 2)
    ) {
      result.push([this.row + direction * 2, this.col - 1 * 2]);
    }
    if (
      !boardData.isEmpty(this.row + direction, this.col + 1) &&
      boardData.isEnemy(this.row + direction, this.col + 1) &&
      boardData.isEmpty(this.row + direction * 2, this.col + 1 * 2)
    ) {
      result.push([this.row + direction * 2, this.col + 1 * 2]);
    }

    return result;
  }

  getNormaleMoves() {
    // TODO: add the Queen steps.
    // Find the possibleMoves:
    let moves;

    if (this.type === PAWN) {
      moves = this.getPawnNormalMoves();
    }
    if (this.type === KING) {
      moves = this.getKingNormalMoves();
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

  getKingNormalMoves() {
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
