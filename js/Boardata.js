class BoardData {
  constructor() {
    this.pieces = this.initPieces();
  }

  initPieces() {
    // Create list of pieces (32 total)
    let piecesArray = [];
    let col = [0, 2, 4, 6];
    for (let number of col) {
      piecesArray.push(new Piece(0, number + 1, PAWN, WHITE_PLAYER));
      piecesArray.push(new Piece(1, number, PAWN, WHITE_PLAYER));
      piecesArray.push(new Piece(2, number + 1, PAWN, WHITE_PLAYER));
      piecesArray.push(new Piece(5, number, PAWN, BLACK_PLAYER));
      piecesArray.push(new Piece(6, number + 1, PAWN, BLACK_PLAYER));
      piecesArray.push(new Piece(7, number, PAWN, BLACK_PLAYER));
    }
    return piecesArray;
  }

  getPiece(row, col) {
    // Returns piece in row, col, or undefined if not exists.
    for (const piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
  }

  removePiece(row, col) {
    // If there is a piece in the cell - remove it ! :
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        this.pieces.splice(i, 1);
        return piece;
      }
    }
  }

  isEmpty(row, col) {
    //  If there is nothing in the cell - return true:
    return this.getPiece(row, col) === undefined;
  }

  isEnemy(row, col) {
    //  If there is enemy piece in the cell - return true:
    let piece = this.getPiece(row, col);
    return piece.player !== game.currentPlayer;
  }
}
