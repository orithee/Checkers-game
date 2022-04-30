class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }

  getOpponent() {
    if (this.player === WHITE_PLAYER) {
      return BLACK_PLAYER;
    }
    return WHITE_PLAYER;
  }

  //   TODO: eatingDirections !!

  getPossibleMoves() {
    // Find the possibleMoves:
    let moves;

    if (this.type === PAWN) {
      moves = this.getPawnMoves();
    }
    return this.filteredMoves(moves);
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
  getPawnMoves() {
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

  //   getQueenMoves(boardData) {
  //     let result = [];
  //     result = result.concat(this.getMovesInDirection(-1, -1, boardData));
  //     result = result.concat(this.getMovesInDirection(-1, 1, boardData));
  //     result = result.concat(this.getMovesInDirection(1, -1, boardData));
  //     result = result.concat(this.getMovesInDirection(1, 1, boardData));
  //     return result;
  //   }

  //   getMovesInDirection(directionRow, directionCol, boardData) {
  //     let result = [];

  //     for (let i = 1; i < BOARD_SIZE; i++) {
  //       let row = this.row + directionRow * i;
  //       let col = this.col + directionCol * i;
  //       if (boardData.isEmpty(row, col)) {
  //         result.push([row, col]);
  //       } else if (boardData.isPlayer(row, col, this.player)) {
  //         return result;
  //       } else {
  //         result.push([row, col]);
  //         return result;
  //       }
  //     }
  //     return result;
  //   }
}
