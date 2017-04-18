import log, {hookConsoleLog} from 'stacklogger'

// Model
const player = (name, mark = 'O') => ({name, mark})
const player1 = player('Hal', 'X')
const player2 = player('Me', 'O')
let currentPlayer = player1

const board = [
  '', '', '',
  '', '', '',
  '', '', ''
]

// View
const squares = Array.from(document.querySelectorAll('.game span'))

// Controller
const changeTurn = () => {
  currentPlayer = currentPlayer === player1 ? player2 : player1
}

const placeMark = e => {
  e.target.innerText = currentPlayer.mark
  board[e.target.id.split('-')[1]] = currentPlayer.mark
  changeTurn()
}

// initialize
function init() {
  try {
    // Events
    squares.forEach(el => el.onclick = placeMark)
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
