import log, {hookConsoleLog} from 'stacklogger'

// Model
const player = (name, mark = 'O') => ({name, mark})
const player1 = player('Hal', 'X')
const player2 = player('Me', 'O')
let currentPlayer = player1
let moveCount = 0

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
  moveCount++
}

const play = square => {
  document.getElementById(`box-${square}`).innerText = currentPlayer.mark
  board[square] = currentPlayer.mark
  moveCount++
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const delay = amount => new Promise(resolve => setTimeout(resolve, amount))

// Events
squares.forEach(el => el.onclick = async e => {
  placeMark(e)
  // todo: checkForWin()
  changeTurn()
  await delay(1200)
  // todo: checkForBlock()
  // todo: checkForWinningMove()
  play(getRandomIntInclusive(0, 8))
  // todo: checkForWin()
  changeTurn()
})

// initialize
function init() {
  try {
    play(getRandomIntInclusive(0, 8))
    changeTurn()
    log(moveCount)
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
