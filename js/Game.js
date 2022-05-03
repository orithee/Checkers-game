class Game {
  constructor(firstPlayer) {
    this.currentPlayer = firstPlayer;
    this.winner = undefined;
  }

  Conditions() {
    // Remove the alerts "notYourTurn","youMustEat" :
    notYourTurn.remove();
    youMustEat.remove();

    // If the game is over - exit the function:
    if (game.winner !== undefined) {
      return false;
    }
    return true;
  }

  showPossibleMovesOnBoard(row, col) {
    // The possible moves of the pressed cell will appear:
    const piece = boardData.getPiece(row, col);

    // 1. If the cell is empty (undefined) skip it:
    if (piece !== undefined) {
      // 2. If this is not the turn of the player who clicked - exit the function:
      if (this.currentPlayer !== piece.player) {
        notYourTurn.classList.add("notYourTurn");
        notYourTurn.textContent = "This is not your turn";
        table.appendChild(notYourTurn);
        selectedPiece = undefined;
        return;
      }

      // 3. Show possible moves - If there are 'eatingMoves' - show them. If not - show the 'normalMoves':
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

    // TODO: give some alert - 'choose one or double !'
    // TODO: Check exactly the status of 'doubleEating' - true / false all the code

    // 1. If he try possible move of eatingMove - its okay, do it.
    if (this.tryDoEatingMove(piece, row, col)) return true;

    // 2. If he was in a 'doubleEating' state and did not eat - 'changeCurrentPlayer' and exit the function:
    if (doubleEating === true) {
      doubleEating = false;
      this.changeCurrentPlayer();
      return true;
    }

    // 3. Before he tries a normal move - check: if he has the option to eat - exit the function. He must eat!
    if (this.CheckIfEatingIsPossible()) return false;

    // 4. If he can't eat - he can take a normal move.
    if (this.tryDoNormalMove(piece, row, col)) return true;

    // 5. If he did not take a move - exit the function. The player has to choose another cell.
    return false;
  }

  tryDoEatingMove(piece, row, col) {
    // The function checks if the player has made an eating move:
    // 1. If we are in a state of 'doubleEating' the possibleMoves are only of a 'doubleEating'.
    let possibleMoves;
    if (doubleEating === true) {
      possibleMoves = piece.CheckDoubleEating([piece.row, piece.col]);
    } else {
      // Otherwise - 'eatingMoves' per piece:
      possibleMoves = piece.getEatingMoves();
    }
    // 2. If the player clicks on a cell that is not in the options - the 'EatingMove' did not take place - return false:
    if (possibleMoves[0] !== undefined) {
      for (const possibleMove of possibleMoves) {
        if (possibleMove[0] === row && possibleMove[1] === col) {
          // 3. There is a legal move, so 'removePieceEaten' + 'makeTheMove' :
          boardData.removePieceEaten(piece, row, col, possibleMove);
          this.makeTheMove(piece, row, col);

          // 4. Check if now he has the option to "doubleEating":
          let double = piece.CheckDoubleEating([piece.row, piece.col]);
          if (double[0] !== undefined) {
            double = piece.filteredMoves(double);
            if (double[0] !== undefined) {
              for (let option of double) {
                let cell = table.rows[option[0]].cells[option[1]];
                cell.classList.add("possible-move");
              }
              doubleEating = true;
              this.oneTimeExplanatoryMessage();
              return true;
            }
          }
          doubleEating = false;
          this.changeCurrentPlayer();
          return true;
        }
      }
    }

    return false;
  }

  makeTheMove(piece, row, col) {
    // 1. Change the piece location + his image:
    let pieceImage = table.rows[piece.row].cells[piece.col].innerHTML;
    table.rows[piece.row].cells[piece.col].innerHTML = "";
    table.rows[row].cells[col].innerHTML = pieceImage;

    piece.row = row;
    piece.col = col;

    // 2. If the piece has reached the last row - make it "QUEEN":
    if (piece.type === PAWN) {
      if (
        (this.currentPlayer === WHITE_PLAYER && piece.row === 7) ||
        (this.currentPlayer === BLACK_PLAYER && piece.row === 0)
      ) {
        piece.type = QUEEN;
        const image = document.createElement("img");
        image.src = "images/" + this.currentPlayer + "-queen.png";
        image.draggable = false;
        table.rows[piece.row].cells[piece.col].innerHTML = "";
        table.rows[piece.row].cells[piece.col].appendChild(image);
      }
    }
    boardData.clearBoard();
    return true;
  }

  CheckIfEatingIsPossible() {
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
      youMustEat.classList.add("must-eat");
      youMustEat.textContent = "You Must Eat!";
      table.appendChild(youMustEat);
      return true;
    }
  }

  tryDoNormalMove(piece, row, col) {
    let possibleMoves = piece.getNormaleMoves();
    for (const possibleMove of possibleMoves) {
      if (possibleMove[0] === row && possibleMove[1] === col) {
        // There is a legal move, so do this - Change the piece location + Finish this turn:
        if (this.makeTheMove(piece, row, col)) {
          this.changeCurrentPlayer();
          return true;
        }
      }
    }
    return false;
  }

  changeCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer === BLACK_PLAYER ? WHITE_PLAYER : BLACK_PLAYER;
    document.querySelector(".player-1").classList.toggle("player--active");
    document.querySelector(".player-2").classList.toggle("player--active");
  }

  oneTimeExplanatoryMessage() {
    if (oneTimeMessage === undefined) {
      let doubleEatingMessage = document.querySelector("#double-message");
      table.appendChild(doubleEatingMessage);
      doubleEatingMessage.classList.remove("hiden");
      doubleEatingMessage.addEventListener("click", () => {
        doubleEatingMessage.classList.add("hiden");
      });
      oneTimeMessage = "dont show again";
    }
  }
}
