const gameBoard = (function () {
  let board = new Array(9);
  let movesLeft = 0;

  const winConditions = [7, 56, 73, 84, 146, 273, 292, 448];

  const addMark = (position, markType) => {
    movesLeft++;
    board[position] = markType;
  };

  const checkPositionForMark = (position) => {
    return board[position] == null ? false : true;
  };

  const checkWin = (markType) => {
    let currentState = board.reduce((accumulator, currentValue, index) => {
      currentValue === markType
        ? (accumulator += Math.pow(2, index))
        : (accumulator += 0);
      return accumulator;
    }, 0);

    let markWon = winConditions.some((value) => {
      return (currentState & value) === value;
    });
    if (!markWon && movesLeft == 9) return "tie";
    else return markWon;
  };

  const clearBoard = () => {
    board = Array(9);
    movesLeft = 0;
  };

  return { addMark, checkWin, checkPositionForMark, clearBoard };
})();

const player = function (playerName, playerMark) {
  let name = playerName;
  let mark = playerMark;

  const getMark = () => {
    return mark;
  };

  const getName = () => {
    return name;
  };

  return { getMark, getName };
};

const gameManager = (function () {
  let players = [];
  let currentPlayer;

  let initGame = () => {
    gameManager.addPlayer("Puta", "x");
    gameManager.addPlayer("Caca", "o");
    initSquares();
    currentPlayer = players[0];
  };
  const doTurn = (square) => {
    let index = Array.from(square.parentNode.children).indexOf(square);

    if (gameBoard.checkPositionForMark(index)) return;
    gameBoard.addMark(index, currentPlayer.getMark());

    gameVisual.addVisual(square, currentPlayer.getMark());

    console.log(gameBoard.checkWin(currentPlayer.getMark()));

    if (gameBoard.checkWin(currentPlayer.getMark()) == "tie") {
      gameTie();
    } else if (gameBoard.checkWin(currentPlayer.getMark()) == true) {
      gameWon(currentPlayer);
    }

    changeMark();
  };

  const gameWon = (player) => {
    gameVisual.setEndGameModal(true, player.getName());
  };

  const gameTie = () => {
    gameVisual.setEndGameModal(true, "", true);
  };

  const changeMark = () => {
    currentPlayer === players[0]
      ? (currentPlayer = players[1])
      : (currentPlayer = players[0]);
    gameVisual.toggleTurnText();
  };

  const initSquares = () => {
    let squares = document.querySelectorAll(".gamesquare");
    squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        doTurn(event.target);
      });
    });
  };

  const addPlayer = (name, mark) => {
    players.push(player(name, mark));
  };
  const clearPlayers = () => {
    players = [];
  };

  const clearGame = () => {
    clearPlayers();
    gameBoard.clearBoard();
    gameVisual.clearSquareVisual();
  };

  return { addPlayer, doTurn, initGame, clearGame };
})();

const gameVisual = (function () {
  const markVisuals = {
    x: "svgs/cross-svgrepo-com.svg",
    o: "svgs/circle-svgrepo-com.svg",
  };

  const gameTurnText = {
    wait: "Waiting for your turn...",
    current: "It's your turn!",
  };

  const leftPlayerInput = document.querySelector("#left-player-name");
  const rightPlayerInput = document.querySelector("#right-player-name");

  const overlay = document.querySelector("#overlay");
  const gameStartModal = document.querySelector("#game-start-modal");
  const startGameButton = document.querySelector("#start-game-button");

  const gameEndModal = document.querySelector("#game-end-modal");
  const gameRestartButton = document.querySelector("#game-restart-button");
  const gameResultText = document.querySelector("#game-result-text");

  const leftPlayer = {
    name: document.querySelector("#left-player>h2"),
    turnText: document.querySelector("#left-player>h3"),
  };
  const rightPlayer = {
    name: document.querySelector("#right-player>h2"),
    turnText: document.querySelector("#right-player>h3"),
  };

  const addVisual = (square, markType) => {
    let visual = document.createElement("img");
    visual.src = markVisuals[markType];

    square.appendChild(visual);
  };

  const setStartModalState = (state) => {
    if (state == true) {
      overlay.style["display"] = "flex";
      gameStartModal.style["display"] = "flex";
    } else {
      overlay.style["display"] = "none";
      gameStartModal.style["display"] = "none";
    }
  };

  const setEndGameModal = (state, playerWon, tie = false) => {
    if (state == true) {
      overlay.style["display"] = "flex";
      gameEndModal.style["display"] = "flex";
      if (tie) {
        gameResultText.textContent = "The game end with a tie!";
        return;
      } else gameResultText.textContent = `${playerWon} has won`;
    } else {
      overlay.style["display"] = "none";
      gameEndModal.style["display"] = "none";
    }
  };

  const startGame = () => {
    gameManager.clearGame();
    gameManager.addPlayer(leftPlayerInput.value, "x");
    gameManager.addPlayer(rightPlayerInput.value, "o");

    setPLayerName(leftPlayer, leftPlayerInput.value);
    setPLayerName(rightPlayer, rightPlayerInput.value);
    setStartModalState(false);

    gameManager.initGame();
  };

  startGameButton.addEventListener("click", () => {
    startGame();
  });

  gameRestartButton.addEventListener("click", () => {
    setEndGameModal(false, "");
    setStartModalState(true);
  });

  const setPLayerName = (player, name) => {
    player.name.textContent = name;
  };

  const toggleTurnText = () => {
    if (leftPlayer.turnText.textContent == gameTurnText.wait) {
      leftPlayer.turnText.textContent = gameTurnText.current;
      rightPlayer.turnText.textContent = gameTurnText.wait;
    } else {
      leftPlayer.turnText.textContent = gameTurnText.wait;
      rightPlayer.turnText.textContent = gameTurnText.current;
    }
  };

  const clearSquareVisual = () => {
    let squares = document.querySelectorAll(".gamesquare");
    squares.forEach((square) => {
      if (square.lastChild != null) square.removeChild(square.lastChild);
    });
  };

  return { addVisual, toggleTurnText, setEndGameModal, clearSquareVisual };
})();
