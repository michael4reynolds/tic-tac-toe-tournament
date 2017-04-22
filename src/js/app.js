import log, {hookConsoleLog} from 'stacklogger'

// Model
const player = (name, mark = 'O') => ({name, mark})
const player1 = player('Hal', 'X')
const player2 = player('Me', 'O')
let currentPlayer = player1
let moveCount = 0
let waiting = false
let gameOver = false
const combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]]
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

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const delay = amount => new Promise(resolve => setTimeout(() => {
  waiting = false
  resolve()
}, amount))

const checkForWin = () => combos.some(c =>
  c.every(mark => board[mark] === currentPlayer.mark))

const checkForDraw = () => moveCount === 9

const legalMoves = () => board.reduce((a, e, i) => {
  if (e === '') a.push(i)
  return a
}, [])

const moveLoop = async e => {
  if (e.target.innerText || waiting || gameOver) return
  placeMark(e)
  if (checkForWin()) {
    gameOver = true
    log(currentPlayer.name, 'wins!!!')
    return
  }
  if (checkForDraw()) {
    log('Draw!')
    return
  }
  changeTurn()
  waiting = true
  await delay(1200)
  // todo: playWinningMove()
  // todo: blockOpponent()
  let legal = legalMoves()
  log(legal)
  play(legal[getRandomInt(0, legal.length)])
  if (checkForWin()) {
    gameOver = true
    log(currentPlayer.name, 'wins!!!')
    return
  }
  if (checkForDraw()) {
    log('Draw!')
    return
  }
  changeTurn()
}

// Events
squares.forEach(el => el.onclick = moveLoop)

// initialize
function init() {
  try {
    let legal = legalMoves()
    log(legal)
    play(legal[getRandomInt(0, legal.length)])
    changeTurn()
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
