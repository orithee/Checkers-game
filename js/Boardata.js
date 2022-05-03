class BoardData {
  constructor() {
    this.pieces = this.initPieces();
  }

  initPieces() {
    // Create list of pieces (24 total):
    let piecesArray = [];
    let col = [0, 2, 4, 6];
    for (const number of col) {
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
    // Add pieces images to board:
    for (const piece of this.pieces) {
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
        if ((j + i) % 2 !== 0)
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

  removePieceEaten(piece, row, col, possibleMove) {
    //1. Find the exact location of the piece eaten :
    if (possibleMove[0] > piece.row && possibleMove[1] > piece.col) {
      row -= 1;
      col -= 1;
    } else if (possibleMove[0] > piece.row && piece.col > possibleMove[1]) {
      row -= 1;
      col += 1;
    } else if (piece.row > possibleMove[0] && piece.col > possibleMove[1]) {
      row += 1;
      col += 1;
    } else if (piece.row > possibleMove[0] && possibleMove[1] > piece.col) {
      row += 1;
      col -= 1;
    }

    //2. Remove the piece eaten from the board :
    table.rows[row].cells[col].innerHTML = "";
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        this.pieces.splice(i, 1);
      }
    }
  }

  isEmpty(row, col) {
    //  If there is no piece in the cell - return true:
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
    for (const piece of this.pieces) {
      if (piece.player === game.currentPlayer) {
        piecesNextPlayer.push(piece);
      }
    }

    // 2. Get an array of possible moves of each piece of the player who played last:
    let possibleMovesThisTurn = [];
    for (const piece of piecesNextPlayer) {
      possibleMovesThisTurn = possibleMovesThisTurn.concat(
        piece.getEatingMoves()
      );
      possibleMovesThisTurn = possibleMovesThisTurn.concat(
        piece.getNormaleMoves()
      );
    }

    // 3. If he has no more pieces / has no possible move - he has lost the game:
    if (possibleMovesThisTurn[0] === undefined) {
      game.changeCurrentPlayer();
      game.winner = game.currentPlayer;
      this.endOfTheGame();
    }
  }

  endOfTheGame() {
    if (game.winner !== undefined) {
      // We have a winner! Finish the game:
      const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
      WINNER_POPUP.classList.add("victory-jumps");
      WINNER_POPUP.textContent = winner + " player wins!";
      table.appendChild(WINNER_POPUP);
      NEW_GAME.classList.add("new-game");
      NEW_GAME.textContent = "🔄 New - game";
      table.appendChild(NEW_GAME);
      NEW_GAME.addEventListener("click", () => this.Restart());
    }
  }

  Restart() {
    // Reset the data - a new game:
    table.remove();
    initGame();
    WINNER_POPUP.classList.remove();
    NEW_GAME.classList.remove();
    document.querySelector(".player-1").classList.add("player--active");
    document.querySelector(".player-2").classList.remove("player--active");
  }
}
