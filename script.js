const Game = (function() {
  const X_PLAYER = 'x';
  const O_PLAYER = 'o';
  const oScoreBoard = document.getElementById('o-player');
  const xScoreBoard = document.getElementById('x-player');
  const gameBoard = document.querySelector('.game-board');
  const mode_div = document.querySelector('.mode');
  const mode_btns = document.querySelectorAll('.mode-btns button');
  const cell_divs = document.querySelectorAll('.cell');
  const restart_btn = document.getElementById('restart');
  let mode = '';
  let xTurn = true;

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
    gameBoard.classList.remove(O_PLAYER);
    gameBoard.classList.remove(X_PLAYER);
    if (xTurn) {
      gameBoard.classList.add(O_PLAYER);
    } else {
      gameBoard.classList.add(X_PLAYER);
    }
  }

  function handleClick(e) {
    const currentPlayer = xTurn ? X_PLAYER : O_PLAYER;
    addMark(e, currentPlayer);
    highlightCurrentPlayer();
    setBoardHoverClass();

    // check for win
    // check for draw
    xTurn = !xTurn;
  }
  
  function startGame() {
    mode_div.classList.add('show');

    mode_btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        mode = e.target.dataset.mode;
        document.querySelector('.mode').classList.remove('show');
      });
    });

    cell_divs.forEach(cell => {
      cell.addEventListener('click', handleClick, {once: true});
    });

    restart_btn.addEventListener('click', () => {
      location.reload();
    });
  }

  return {startGame};
})();

Game.startGame();
