let mode = '';

window.addEventListener('load', () => {
  document.querySelector('.mode').classList.add('show');
});

document.querySelectorAll('.mode-btns button').forEach(btn => btn.addEventListener('click', (e) => {
  mode = e.target.dataset.mode;
  document.querySelector('.mode').classList.remove('show');
}));

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', addMark, {once: true}));

document.getElementById('restart').addEventListener('click', () => {
  location.reload();
});

function addMark(e) {
  let xTurn = true;
  if (xTurn) {
    e.target.classList.add('x');
    document.getElementById('o-player').classList.add('o');
    document.getElementById('x-player').classList.remove('x');
    document.querySelector('.game-board').classList.remove('x');
    document.querySelector('.game-board').classList.add('o');
  } else {
    e.target.classList.add('o');
    document.getElementById('o-player').classList.remove('o');
    document.getElementById('x-player').classList.add('x');
    document.querySelector('.game-board').classList.add('x');
    document.querySelector('.game-board').classList.remove('o');
  }
  xTurn = !xTurn;
}