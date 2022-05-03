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

  addImages() {
    // Add pieces images to board
    for (let piece of this.pieces) {
      const cell = table.rows[piece.row].cells[piece.col];
      const image = document.createElement("img");
      image.src = "images/" + piece.player + ".png";
      image.draggable = false;
      cell.appendChild(image);
    }
  }

  clearBoard() {
    // Clear all previous possible moves + previous selected cell:
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        table.rows[i].cells[j].classList.remove("possible-move");
        table.rows[i].cells[j].classList.remove("selected");
      }
    }
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

  enemyPieceLocation(piece, row, col, possibleMove) {
    // Remove the enemy piece - The following code will work on all possible types of eating in the game :

    if (possibleMove[0] > piece.row && possibleMove[1] > piece.col) {
      table.rows[row - 1].cells[col - 1].innerHTML = "";
      boardData.removePiece(row - 1, col - 1);
    }

    if (possibleMove[0] > piece.row && piece.col > possibleMove[1]) {
      table.rows[row - 1].cells[col + 1].innerHTML = "";
      boardData.removePiece(row - 1, col + 1);
    }

    if (piece.row > possibleMove[0] && piece.col > possibleMove[1]) {
      table.rows[row + 1].cells[col + 1].innerHTML = "";
      boardData.removePiece(row + 1, col + 1);
    }
    if (piece.row > possibleMove[0] && possibleMove[1] > piece.col) {
      table.rows[row + 1].cells[col - 1].innerHTML = "";
      boardData.removePiece(row + 1, col - 1);
    }
  }

  isEmpty(row, col) {
    //  If there is nothing in the cell - return true:
    return this.getPiece(row, col) === undefined;
  }

  isEnemy(row, col) {
    //  If there is enemy piece in the cell - return true:
    let piece = this.getPiece(row, col);
    if (piece !== undefined) {
      return piece.player !== game.currentPlayer;
    }
    return false;
  }

  checkingIfGameOver() {
    // 1. Get an array of the next player's pieces:
    let piecesNextPlayer = [];
    for (let piece of this.pieces) {
      if (piece.player === game.currentPlayer) {
        piecesNextPlayer.push(piece);
      }
    }

    // 2. Get an array of possible moves of each piece of the player who played last:
    let possibleMovesThisTurn = [];
    for (let piece of piecesNextPlayer) {
      possibleMovesThisTurn = possibleMovesThisTurn.concat(
        piece.getEatingMoves()
      );
      possibleMovesThisTurn = possibleMovesThisTurn.concat(
        piece.getNormaleMoves()
      );
    }

    // 3. If he has no more pieces / has no possible move - he has lost the game:
    if (
      piecesNextPlayer[0] === undefined ||
      possibleMovesThisTurn[0] === undefined
    ) {
      game.changeCurrentPlayer();
      game.winner = game.currentPlayer;
      this.endOfTheGame();
    }
  }

  endOfTheGame() {
    if (game.winner !== undefined) {
      // We have a winner! Finish the game:
      const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
      winnerPopup.classList.add("victory-jumps");
      winnerPopup.textContent = winner + " player wins!";
      table.appendChild(winnerPopup);
      newGame.classList.add("new-game");
      newGame.textContent = "🔄 New - game";
      table.appendChild(newGame);
      newGame.addEventListener("click", () => this.Restart());
    }
  }

  Restart() {
    // Reset the data - a new game:
    table.remove();
    initGame();
    winnerPopup.classList.remove();
    newGame.classList.remove();
    document.querySelector(".player-1").classList.add("player--active");
    document.querySelector(".player-2").classList.remove("player--active");
  }
}
