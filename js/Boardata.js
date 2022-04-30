class BoardData {
  constructor() {
    this.initPieces();
  }

  initPieces() {
    // Create list of pieces (32 total)
    this.pieces = [];

    this.pieces.push(new Piece(0, 1, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(0, 3, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(0, 5, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(0, 7, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(1, 0, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(1, 2, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(1, 4, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(1, 6, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(2, 1, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(2, 3, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(2, 5, PAWN, WHITE_PLAYER));
    this.pieces.push(new Piece(2, 7, PAWN, WHITE_PLAYER));

    this.pieces.push(new Piece(5, 0, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(5, 2, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(5, 4, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(5, 6, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(6, 1, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(6, 3, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(6, 5, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(6, 7, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(7, 0, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(7, 2, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(7, 4, PAWN, BLACK_PLAYER));
    this.pieces.push(new Piece(7, 6, PAWN, BLACK_PLAYER));
    //   this.pieces.push(new Piece(1, i, PAWN, WHITE_PLAYER));
    //   this.pieces.push(new Piece(6, i, PAWN, BLACK_PLAYER));
    //   this.pieces.push(new Piece(7, i, PIECES[i], BLACK_PLAYER));

    // return pieces;
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

  isPlayer(row, col, player) {
    //  If there is piece with the same player in this cell - return true. else - false :
    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;
  }
}
