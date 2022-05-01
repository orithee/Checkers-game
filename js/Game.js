class Game {
  constructor(firstPlayer) {
    this.currentPlayer = firstPlayer;
    this.winner = undefined;
  }

  showPossibleMovesOnBoard(row, col) {
    // 1. If the game is over - exit the function:
    if (this.winner !== undefined) {
      return;
    }
    // TODO: check if there is some EatingDirections options in his turn - if ve have - dont show the regular moves...

    const piece = boardData.getPiece(row, col);
    // console.log(piece);

    // 2. If this is not the turn of the player who clicked - exit the function:
    if (piece !== undefined && this.currentPlayer !== piece.player) {
      notYourTurn.classList.add("notYourTurn");
      notYourTurn.textContent = "Not your turn";
      table.appendChild(notYourTurn);
      selectedPiece = undefined;
      return;
    }

    if (piece !== undefined) {
      // 3. Show possible moves - If there are eating steps - show them. If not - show the normal steps:
      let possibleMoves;
      possibleMoves = piece.getEatingMoves();
      if (possibleMoves[0] === undefined) {
        possibleMoves = piece.getNormaleMoves();
      }
      for (let possibleMove of possibleMoves) {
        const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
        cell.classList.add("possible-move");
      }
    }

    table.rows[row].cells[col].classList.add("selected");
    selectedPiece = piece;
  }

  tryMove(piece, row, col) {
    // Check if the click for movement is valid:
    // TODO: merge the possible moves for more clearly...

    // 1. If he try possible move of eatingDirections - its okay, do it.
    if (this.tryDoEatingStep(piece, row, col)) return true;

    // 2. Before he tries a normal step - check: if he has the option to eat - exit the function. He must eat!
    if (this.checkIfEatingIsOptional()) return false;

    // 3. If he can not eat - he can take a normal step.
    if (this.tryDoNormalStep(piece, row, col)) return true;

    // TODO: change the image - to queen if black - clack...
    // TODO: good photos, check the names of the pieces...
    // TODO: add steps for the queen...normal + eating.
    // TODO: think how to do big steps...

    // 4. If he did not take a step - exit the function. To choose a new step
    return false;
  }

  tryDoEatingStep(piece, row, col) {
    let possibleMoves = piece.getEatingMoves();
    if (possibleMoves[0] !== undefined) {
      for (const possibleMove of possibleMoves) {
        if (possibleMove[0] === row && possibleMove[1] === col) {
          // There is a legal move, so do this:
          // 1. Remove the enemy piece
          if (possibleMove[0] > piece.row && possibleMove[1] > piece.col) {
            table.rows[row - 1].cells[col - 1].innerHTML = "";
            boardData.removePiece(row - 1, col - 1);
          }

          if (possibleMove[0] > piece.row && possibleMove[1] < piece.col) {
            table.rows[row - 1].cells[col + 1].innerHTML = "";
            boardData.removePiece(row - 1, col + 1);
          }

          if (possibleMove[0] < piece.row && possibleMove[1] < piece.col) {
            table.rows[row + 1].cells[col + 1].innerHTML = "";
            boardData.removePiece(row + 1, col + 1);
          }
          if (possibleMove[0] < piece.row && possibleMove[1] > piece.col) {
            table.rows[row + 1].cells[col - 1].innerHTML = "";
            boardData.removePiece(row + 1, col - 1);
          }

          // 2. Change the piece location:
          if (this.makeTheMove(piece, row, col)) return true;
        }
      }
    }
    return false;
  }

  makeTheMove(piece, row, col) {
    // Change the piece location:
    let pieceImage = table.rows[piece.row].cells[piece.col].innerHTML;
    table.rows[piece.row].cells[piece.col].innerHTML = "";
    table.rows[row].cells[col].innerHTML = pieceImage;

    // boardData.removePiece(row, col);
    piece.row = row;
    piece.col = col;

    // If the piece has reached the last row - make it "king"
    if (
      (this.currentPlayer === WHITE_PLAYER &&
        piece.row === 7 &&
        piece.type === PAWN) ||
      (this.currentPlayer === BLACK_PLAYER &&
        piece.row === 0 &&
        piece.type === PAWN)
    ) {
      piece.type = KING;
      console.log(piece.type);
      const image = document.createElement("img");
      image.src = "images/" + this.currentPlayer + "-king.png";
      image.draggable = false;
      table.rows[piece.row].cells[piece.col].innerHTML = "";
      table.rows[piece.row].cells[piece.col].appendChild(image);
    }

    this.currentPlayer =
      this.currentPlayer === BLACK_PLAYER ? WHITE_PLAYER : BLACK_PLAYER;
    document.querySelector(".Player-1").classList.toggle("player--active");
    document.querySelector(".Player-2").classList.toggle("player--active");
    return true;
  }

  checkIfEatingIsOptional() {
    // Checks if the current player has the option to make a eating move:
    // 1. Get an array of this player pieces:
    let piecesThisPlayer = [];
    for (let piece of boardData.pieces) {
      if (piece.player === this.currentPlayer) {
        piecesThisPlayer.push(piece);
      }
    }

    // 2. Get an array of "possible eating moves" of each piece of this player:
    let possibleMovesThisTurn = [];
    for (let piece of piecesThisPlayer) {
      possibleMovesThisTurn = possibleMovesThisTurn.concat(
        piece.getEatingMoves()
      );
    }

    // 3. If he has no eating steps - exit the function. If he has - he must eat!
    if (possibleMovesThisTurn[0] === undefined) {
      return false;
    } else {
      youMustEat.classList.add("Must-eat");
      youMustEat.textContent = "You Must Eat!";
      table.appendChild(youMustEat);
      return true;
    }
  }

  tryDoNormalStep(piece, row, col) {
    let possibleMoves = piece.getNormaleMoves();
    for (const possibleMove of possibleMoves) {
      if (possibleMove[0] === row && possibleMove[1] === col) {
        // There is a legal move, so do this - Change the piece location:
        if (this.makeTheMove(piece, row, col)) return true;
      }
    }
    return false;
  }

  checkingIfGameOver() {
    // 1. Get an array of the next player's pieces
    let piecesNextPlayer = [];
    for (let piece of boardData.pieces) {
      if (piece.player === this.currentPlayer) {
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
      console.log("game over");
      this.announceTheWinner();
      this.endOfTheGame();
    }
  }

  announceTheWinner() {
    // The player whose turn is now lost - so the other player is the winner:
    game.winner =
      this.currentPlayer === WHITE_PLAYER ? BLACK_PLAYER : WHITE_PLAYER;
  }

  endOfTheGame() {
    if (game.winner !== undefined) {
      // We have a winner! Finish the game
      const winnerPopup = document.createElement("div");
      const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
      winnerPopup.classList.add("Victory-jumps");
      winnerPopup.textContent = winner + " player wins!";
      console.log(winnerPopup.textContent);
      table.appendChild(winnerPopup);
      document.querySelector(".Player-1").classList.toggle("player--active");
      document.querySelector(".Player-2").classList.toggle("player--active");
    }
  }
}
