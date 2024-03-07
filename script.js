const DOMLogic = (function() {
  const X_PLAYER = 'x';
  const O_PLAYER = 'o';
  const oScoreBoard = document.getElementById('o-player');
  const xScoreBoard = document.getElementById('x-player');
  const gameBoard_div = document.querySelector('.game-board');
  const chosenMode_div = document.getElementById('chosen-mode');
  const mode_div = document.querySelector('.mode');
  const mode_btns = document.querySelectorAll('.mode-btns button');
  const restart_btn = document.getElementById('restart');
  const nextGame_btn = document.getElementById('next-game');
  const cell_divs = document.querySelectorAll('.cell');
  const resultMessage_div = document.querySelector('.result-message');
  const winner_span = document.getElementById('winner');
  const result_span = document.getElementById('result');
  const xScore_div = document.getElementById('x-score');
  const oScore_div = document.getElementById('o-score');
  let xTurn = true;
  let gameOver = false;
  let currentPlayer;
  let mode;

  mode_div.classList.add('show'); // show mode selection when page runs

  mode_btns.forEach(btn => btn.addEventListener('click', (e) => { // update game interface after choosing mode
    mode = e.target.dataset.mode;
    if (mode === 'medium') convertMediumMode();
    mode_div.classList.remove('show');
    chosenMode_div.innerText = e.target.innerText;
  }));

  restart_btn.addEventListener('click', () => location.reload()); // reload page when hitting restart

  nextGame_btn.addEventListener('click', (e) => { // update game interface when hitting next game
    clearGameBoard(e);
    gameOver = false;
    if (mode !== 'friend' && !xTurn) AIMode.makeMove();
    if (mode[0] === 'm') convertMediumMode();
  });

  cell_divs.forEach(cell => cell.addEventListener('click', handleClick, {once: true})); // add event listeners for game board's cells

  function convertMediumMode() { // convert medium mode to either easy or unbeatable randomly
    const random = Math.floor(Math.random() * 2);
    random === 0 ? mode = 'med-easy' : mode = 'med-unbeatable';
  }

  function addMark(e, currentPlayer) { // add mark on game board
    e.target.classList.add(currentPlayer);
  }

  function clearGameBoard(e) { // reset game interface
    resultMessage_div.classList.remove('show');
    gameBoard_div.classList.remove('end');
    game.resetGameBoard();
    cell_divs.forEach(cell => {
      cell.classList.remove(X_PLAYER, O_PLAYER);
      cell.addEventListener('click', handleClick, {once: true});
    });
  }

  function highlightCurrentPlayer() { // indicate current player's turn
    oScoreBoard.classList.remove(O_PLAYER);
    xScoreBoard.classList.remove(X_PLAYER);
    if (xTurn) {
      oScoreBoard.classList.add(O_PLAYER);
    } else {
      xScoreBoard.classList.add(X_PLAYER);
    }
  }

  function setBoardHoverClass() { // hovering effect to indicate current mark
    gameBoard_div.classList.remove(O_PLAYER);
    gameBoard_div.classList.remove(X_PLAYER);
    if (xTurn) {
      gameBoard_div.classList.add(O_PLAYER);
    } else {
      gameBoard_div.classList.add(X_PLAYER);
    }
  }

  function handleClick(e) { // chain of updates after every cell's click
    currentPlayer = xTurn ? X_PLAYER : O_PLAYER;
    addMark(e, currentPlayer);
    highlightCurrentPlayer();
    setBoardHoverClass();
    game.updateGameBoard(e);
    ifGameOver();
    xTurn = !xTurn;

    if (mode !== 'friend' && !xTurn && !gameOver) {
      AIMode.makeMove();
    }
  }

  function ifGameOver() { // update game interface when game ends
    if (game.checkForWin(game.getGameBoard(), currentPlayer)) {
      game.updateScore();
      displayResult('win');
      gameOver = true;
    } else if (game.checkForTie(game.getGameBoard())) {
      displayResult('tie');
      gameOver = true;
    }
  }

  function displayResult(result) { // show final results
    if (result === 'tie') {
      winner_span.innerText = '';
      result_span.innerText = 'DRAW';
    } else {
      winner_span.innerText = currentPlayer.toUpperCase();
      result_span.innerText = ' WINS';
      xScore_div.innerText = game.getXScore() ? game.getXScore() : '-';
      oScore_div.innerText = game.getOScore() ? game.getOScore() : '-';
    }
    resultMessage_div.classList.add('show');
    gameBoard_div.classList.add('end');
  }

  return {
    getCurrentPlayer: () => currentPlayer,
    getMode: () => mode,
    getXPlayer: () => X_PLAYER,
    getOPlayer: () => O_PLAYER,
  };
})();

const game = (function() { // module handles game logic
  const gameBoard = ['', '', '', '', '', '', '', '', ''];
  let xScore = 0;
  let oScore = 0;

  function updateGameBoard(e) {
    gameBoard[e.target.dataset.cell] = DOMLogic.getCurrentPlayer();
  }

  function checkForWin(board, player) { // check if there is a winner
    const winCombinations = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8]
    ];

    return winCombinations.some(combination => {
      return combination.every(index => board[index] === player)
    });
  }

  function checkForTie(board) { // check if the game is tie
    return !board.includes('');
  }

  function updateScore() { // update players' score after each game
    (DOMLogic.getCurrentPlayer() === DOMLogic.getXPlayer()) ? xScore++ : oScore++;
  }

  function resetGameBoard() { // clear game board
    gameBoard.forEach((cell, index) => gameBoard[index] = '');
  }

  function getEmptyCells(board) { // get cells that have no marks
    return board.map((cell, index) => cell === '' ? index : undefined).filter(index => index !== undefined);
  }

  return {
    updateGameBoard, 
    checkForWin, 
    checkForTie,
    resetGameBoard,
    updateScore,
    getEmptyCells,
    getXScore: () => xScore,
    getOScore: () => oScore,
    getGameBoard: () => gameBoard,
  };
})();

const AIMode = (function() { // modules handle AI game mode
  const humanPlayer = DOMLogic.getXPlayer();
  const aiPlayer = DOMLogic.getOPlayer();

  function minimax(board, isMaximizing) { // Minimax algorithm to maximize AI's score
    if (game.checkForWin(board, humanPlayer)) {
      return -1;
    } else if (game.checkForWin(board, aiPlayer)) {
      return 1;
    } else if (game.checkForTie(board)) {
      return 0;
    }

    const emptyCells = game.getEmptyCells(board);

    if (isMaximizing) {
      let maxScore = -Infinity;
      emptyCells.forEach(index => {
        const newBoard = [...board];
        newBoard[index] = aiPlayer;
        const score = minimax(newBoard, false);
        maxScore = Math.max(score, maxScore);
      });
      return maxScore;
    } else {
      let minScore = Infinity;
      emptyCells.forEach(index => {
        const newBoard = [...board];
        newBoard[index] = humanPlayer;
        const score = minimax(newBoard, true);
        minScore = Math.min(score, minScore);
      });
      return minScore; 
    }
  }

  function findMove(board, isMaximizing) { // find best AI's move based on scores
    let bestScore = -Infinity;
    let worstScore = Infinity;
    let bestMove;
    let worstMove;

    game.getEmptyCells(board).forEach(index => {
      const newBoard = [...board];
      newBoard[index] = aiPlayer;
      
      if (isMaximizing) {
        const score = minimax(newBoard, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      } else {
        const score = minimax(newBoard, true);
        if (score < worstScore) {
          worstScore = score;
          worstMove = index;
        }
      }
    });

    return {bestMove, worstMove};
  }

  function makeMove() { // determine AI's move depends on game mode
    let move;
    const mode = DOMLogic.getMode();

    if (mode === "easy" || mode === 'med-easy') {
      move = findMove(game.getGameBoard(), false).worstMove;
    } else {
      move = findMove(game.getGameBoard(), true).bestMove;
    }

    document.querySelector(`[data-cell='${move}']`).click();
  }

  return {
    makeMove,
  };
})();