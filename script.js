const DOMLogic = (function() {
  const X_PLAYER = 'x';
  const O_PLAYER = 'o';
  const oScoreBoard = document.getElementById('o-player');
  const xScoreBoard = document.getElementById('x-player');
  const gameBoard_div = document.querySelector('.game-board');
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
  let currentPlayer;
  let mode;

  mode_div.classList.add('show');

  mode_btns.forEach(btn => btn.addEventListener('click', (e) => {
    mode = e.target.dataset.mode;
    document.querySelector('.mode').classList.remove('show');
  }));

  restart_btn.addEventListener('click', () => location.reload());

  nextGame_btn.addEventListener('click', clearGameBoard);

  cell_divs.forEach(cell => cell.addEventListener('click', handleClick, {once: true}));

  function addMark(e, currentPlayer) {
    e.target.classList.add(currentPlayer);
  }

  function clearGameBoard(e) {
    resultMessage_div.classList.remove('show');
    gameBoard_div.classList.remove('end');
    game.resetGameBoard();
    cell_divs.forEach(cell => {
      cell.classList.remove(X_PLAYER, O_PLAYER);
      cell.addEventListener('click', handleClick, {once: true});
    });
  }

  function highlightCurrentPlayer() {
    oScoreBoard.classList.remove(O_PLAYER);
    xScoreBoard.classList.remove(X_PLAYER);
    if (xTurn) {
      oScoreBoard.classList.add(O_PLAYER);
    } else {
      xScoreBoard.classList.add(X_PLAYER);
    }
  }

  function setBoardHoverClass() {
    gameBoard_div.classList.remove(O_PLAYER);
    gameBoard_div.classList.remove(X_PLAYER);
    if (xTurn) {
      gameBoard_div.classList.add(O_PLAYER);
    } else {
      gameBoard_div.classList.add(X_PLAYER);
    }
  }

  function handleClick(e) {
    currentPlayer = xTurn ? X_PLAYER : O_PLAYER;
    addMark(e, currentPlayer);
    highlightCurrentPlayer();
    setBoardHoverClass();
    game.updateGameBoard(e);

    if (game.checkForWin(game.getGameBoard(), currentPlayer)) {
      game.updateScore();
      displayResult('win');
    } else if (game.checkForTie(game.getGameBoard())) {
      displayResult('tie');
    }
    
    xTurn = !xTurn;

    AIMode.playUnbeatable();
  }

  function displayResult(result) {
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
    getXTurn: () => xTurn,
    getCurrentPlayer: () => currentPlayer,
    getMode: () => mode,
    getXPlayer: () => X_PLAYER,
    getOPlayer: () => O_PLAYER,
  };
})();

const game = (function() {
  const gameBoard = ['', '', '', '', '', '', '', '', ''];
  let xScore = 0;
  let oScore = 0;

  function updateGameBoard(e) {
    gameBoard[e.target.dataset.cell] = DOMLogic.getCurrentPlayer();
  }

  function checkForWin(board, player) {
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

  function checkForTie(board) {
    return !board.includes('');
  }

  function updateScore() {
    (DOMLogic.getCurrentPlayer() === DOMLogic.getXPlayer()) ? xScore++ : oScore++;
  }

  function resetGameBoard() {
    gameBoard.forEach((cell, index) => gameBoard[index] = '');
  }

  function getEmptyCells(board) {
    const emptyCells = [];
    board.filter((cell, index) => {
      if (cell === '') emptyCells.push(index);
    });
    return emptyCells;
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

const AIMode = (function() {
  const humanPlayer = DOMLogic.getXPlayer();
  const aiPlayer = DOMLogic.getOPlayer();

  function minimax(board, depth, isMaximizing) {
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
        const score = minimax(newBoard, depth + 1, false);
        maxScore = Math.max(score, maxScore);
      });
      return maxScore;
    } else {
      let minScore = Infinity;
      emptyCells.forEach(index => {
        const newBoard = [...board];
        newBoard[index] = humanPlayer;
        const score = minimax(newBoard, depth + 1, true);
        minScore = Math.min(score, minScore);
      });
      return minScore; 
    }
  }

  function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;

    game.getEmptyCells(board).forEach(index => {
      const newBoard = [...board];
      newBoard[index] = aiPlayer;
      const score = minimax(newBoard, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    });

    return bestMove;
  }

  function playUnbeatable() {
    if (DOMLogic.getMode() === "unbeatable" && !DOMLogic.getXTurn()) {
      const bestMove = findBestMove(game.getGameBoard());
      document.querySelector(`[data-cell='${bestMove}']`).click();
    }
  }

  return {
    playUnbeatable,
  };
})();