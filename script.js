const cell_div = document.querySelectorAll('.cell');
const restart_btn = document.getElementById('restart');
let xTurn = true;

cell_div.forEach(cell => cell.addEventListener('click', addMark));
restart_btn.addEventListener('click', () => {
  location.reload();
})

function addMark(e) {
  if (xTurn) {
    e.target.classList.add('x');
  } else {
    e.target.classList.add('o');
  }
  xTurn = !xTurn;
}