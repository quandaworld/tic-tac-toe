const DOMLogic = (function() {
  const X_PLAYER = 'x';
  const O_PLAYER = 'o';
  const oScoreBoard = document.getElementById('o-player');
  const xScoreBoard = document.getElementById('x-player');
  const gameBoard_div = document.querySelector('.game-board');
  const mode_div = document.querySelector('.mode');
  const mode_btns = document.querySelectorAll('.mode-btns button');
  const restart_btn = document.getElementById('restart');
  const cell_divs = document.querySelectorAll('.cell');
  let xTurn = true;
  let currentPlayer;
  let mode;

  mode_div.classList.add('show');

  mode_btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      mode = e.target.dataset.mode;
      document.querySelector('.mode').classList.remove('show');
    });
  });

  restart_btn.addEventListener('click', () => {
    location.reload();
  });

  cell_divs.forEach(cell => {
    cell.addEventListener('click', handleClick, {once: true});
  });

  function addMark(e, currentPlayer) {
    e.target.classList.add(currentPlayer);
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
    game.checkForWin();
    game.checkForTie();
    xTurn = !xTurn;
  }

  return {
    getCurrentPlayer: () => currentPlayer,
    getMode: () => mode,
  };
})();

const game = (function() {
  const gameBoardArr = ['', '', '', '', '', '', '', '', ''];
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

  function updateGameBoard(e) {
    gameBoardArr.splice(e.target.dataset.cell, 1, DOMLogic.getCurrentPlayer());
  }

  function checkForWin() {

  }

  function checkForTie() {

  }

  return {updateGameBoard, checkForWin, checkForTie};
})();