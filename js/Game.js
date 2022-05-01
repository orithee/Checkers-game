class Game {
  constructor(firstPlayer) {
    this.currentPlayer = firstPlayer;
    this.winner = undefined;
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

  showPossibleMovesOnBoard(row, col) {
    // If the game is over - exit the function:
    if (this.winner !== undefined) {
      return;
    }
    // TODO: check if there is some EatingDirections options in his turn - if ve have - dont show the regular moves...

    const piece = boardData.getPiece(row, col);
    console.log(piece);

    // If this is not the turn of the player who clicked - exit the function:
    if (piece !== undefined && this.currentPlayer !== piece.player) {
      notYourTurn.classList.add("notYourTurn");
      notYourTurn.textContent = "Not your turn";
      table.appendChild(notYourTurn);
      selectedPiece = undefined;
      return;
    }

    // Show possible moves:
    if (piece !== undefined) {
      // TODO : get the possible move of eatingDirections.
      // TODO : if he have some possible move of eatingDirections dont show the regular steps:
      let possibleMoves;
      //   console.log(possibleMoves);
      // TODO: if possibleMoves have no possible move - so do the else:
      possibleMoves = piece.getEatingDirections();
      console.log(possibleMoves[0]);
      if (possibleMoves[0] !== undefined) {
        for (let possibleMove of possibleMoves) {
          const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
          cell.classList.add("possible-move");
        }
      } else {
        possibleMoves = piece.getPossibleMoves();
        for (let possibleMove of possibleMoves) {
          const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
          cell.classList.add("possible-move");
        }
      }
    }

    table.rows[row].cells[col].classList.add("selected");
    selectedPiece = piece;
  }

  tryGetEatingDirections(piece, row, col) {
    let possibleMoves = piece.getEatingDirections();
    if (possibleMoves[0] !== undefined) {
      for (const possibleMove of possibleMoves) {
        if (possibleMove[0] === row && possibleMove[1] === col) {
          //   TODO: change the piece location, remove the enemy piece
          if (this.currentPlayer === BLACK_PLAYER) {
            if (possibleMove[1] > piece.col) {
              table.rows[row + 1].cells[col - 1].innerHTML = "";
              boardData.removePiece(row + 1, col - 1);
            } else {
              table.rows[row + 1].cells[col + 1].innerHTML = "";
              boardData.removePiece(row + 1, col + 1);
            }
          } else {
            if (possibleMove[1] > piece.col) {
              table.rows[row - 1].cells[col - 1].innerHTML = "";
              boardData.removePiece(row - 1, col - 1);
            } else {
              table.rows[row - 1].cells[col + 1].innerHTML = "";
              boardData.removePiece(row - 1, col + 1);
            }
          }

          let pieceImage = table.rows[piece.row].cells[piece.col].innerHTML;
          table.rows[piece.row].cells[piece.col].innerHTML = "";
          table.rows[row].cells[col].innerHTML = pieceImage;

          boardData.removePiece(row, col);
          piece.row = row;
          piece.col = col;

          this.currentPlayer = piece.getOpponent();
          document
            .querySelector(".Player-1")
            .classList.toggle("player--active");
          document
            .querySelector(".Player-2")
            .classList.toggle("player--active");

          return true;
        }
      }
    }
    return false;
  }
  tryGetRegularStep(piece, row, col) {
    let possibleMoves = piece.getPossibleMoves();
    for (const possibleMove of possibleMoves) {
      if (possibleMove[0] === row && possibleMove[1] === col) {
        // There is a legal move, so do this:
        // const removedPiece = this.boardData.removePiece(row, col);
        // let lastPieceRow = piece.row;
        // let lastPieceCol = piece.col;
        // let lastImage = table.rows[row].cells[col].innerHTML;

        let pieceImage = table.rows[piece.row].cells[piece.col].innerHTML;
        table.rows[piece.row].cells[piece.col].innerHTML = "";
        table.rows[row].cells[col].innerHTML = pieceImage;

        boardData.removePiece(row, col);
        piece.row = row;
        piece.col = col;

        this.currentPlayer = piece.getOpponent();
        document.querySelector(".Player-1").classList.toggle("player--active");
        document.querySelector(".Player-2").classList.toggle("player--active");
        return true;
      }
    }
    return false;
  }
  checkIfEatingIsOptional() {
    // Checks if the current player has the option to make a eating move:
    let piecesThisPlayer = [];
    for (let piece of boardData.pieces) {
      if (piece.player === this.currentPlayer) {
        piecesThisPlayer.push(piece);
      }
    }
    console.log(piecesThisPlayer);
    // Get an array of possible moves of each soldier of the player who played last:
    let possibleMovesThisTurn = [];
    for (let piece of piecesThisPlayer) {
      possibleMovesThisTurn = possibleMovesThisTurn.concat(
        piece.getEatingDirections()
      );
    }

    console.log(possibleMovesThisTurn);
    if (possibleMovesThisTurn[0] === undefined) {
      return false;
    } else {
      mustEat.classList.add("Check-position");
      mustEat.textContent = "You Must Eat!";
      table.appendChild(mustEat);
      console.log("you must eat !");
      return true;
    }
  }
  tryMove(piece, row, col) {
    // Check if the click for movement is valid:
    // TODO: merge the possible moves for more clearly...

    if (this.tryGetEatingDirections(piece, row, col)) return true;
    // TODO:
    if (this.checkIfEatingIsOptional()) return false;

    if (this.tryGetRegularStep(piece, row, col)) return true;

    // TODO : if he try possible move of eatingDirections - its okay.
    // TODO : if he try regular possible move - check if he was can do possible move of eatingDirections.
    //  if he had some possible move of eatingDirections - cancel this movement.
    //  but check it before this movement !!!
    // remember to return image !

    // Change the currentPlayer:

    return false;
  }

  cancelThisMovement(piece, lastPieceRow, lastPieceCol, removedPiece) {
    // Cancel the last movement:
    piece.row = lastPieceRow;
    piece.col = lastPieceCol;
    if (removedPiece !== undefined) {
      this.boardData.pieces.push(
        new Piece(
          removedPiece.row,
          removedPiece.col,
          removedPiece.type,
          removedPiece.player
        )
      );
    }
  }

  // checkingIfCheck() {
  //   // Find the pieces the previous player has on the board:
  //   let piecesPreviousPlayer = [];
  //   for (let piece of game.boardData.pieces) {
  //     if (piece.getOpponent() === game.currentPlayer) {
  //       piecesPreviousPlayer.push(piece);
  //     }
  //   }

  //   // Get an array of possible moves of each soldier of the player who played last:
  //   let possibleMovesNextTurn = [];
  //   for (let piece of piecesPreviousPlayer) {
  //     possibleMovesNextTurn = possibleMovesNextTurn.concat(
  //       piece.getPossibleMoves(game.boardData)
  //     );
  //   }

  //   // Finding the oponnent King's Location(row, col) - like this : [0, 3]
  //   let kingLocation;
  //   for (let piece of game.boardData.pieces) {
  //     if (piece.type === KING && piece.player === game.currentPlayer) {
  //       kingLocation = [piece.row, piece.col];
  //     }
  //   }

  //   // Check if one of the next cells that the last player can advance to is the King's cell:
  //   for (let i = 0; i < possibleMovesNextTurn.length; i++) {
  //     if (
  //       possibleMovesNextTurn[i][0] === kingLocation[0] &&
  //       possibleMovesNextTurn[i][1] === kingLocation[1]
  //     ) {
  //       const Check = document.createElement("div");
  //       Check.classList.add("Check-position");
  //       Check.textContent = "Check!";
  //       table.appendChild(Check);

  //       return true;
  //     }
  //   }
  // }
}
