const cell_div = document.querySelectorAll('.cell');
const restart_btn = document.getElementById('restart');
let xTurn = true;

cell_div.forEach(cell => cell.addEventListener('click', addMark, {once: true}));

restart_btn.addEventListener('click', () => {
  location.reload();
});

function addMark(e) {
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