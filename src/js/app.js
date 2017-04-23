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
let nextPlayer = function () {
  return currentPlayer === player1 ? player2 : player1
}

const changeTurn = () => {
  currentPlayer = nextPlayer()
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

const legalMoves = arr => arr.reduce((a, e, i) => {
  if (e === '') a.push(i)
  return a
}, [])

const checkForWin = () => combos.some(c =>
  c.every(i => board[i] === currentPlayer.mark))

const twoSquaresDone = player => combos.filter(c =>
  c.filter(i => board[i] === player.mark).length === 2
)

const winningMoves = arr => {
  return arr.reduce((a, e) => {
    let emptySquare = e.filter(i => board[i] === '')[0]
    if (emptySquare !== undefined) {
      a.push(emptySquare)
    }
    return a
  }, [])
}

const checkForDraw = () => moveCount === 9

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
  let arr = twoSquaresDone(currentPlayer)
  let winners = winningMoves(arr)
  if (winners.length) {
    play(winners[getRandomInt(0, winners.length)])
    gameOver = true
    log(currentPlayer.name, 'wins!!!')
  } else {
    arr = twoSquaresDone(nextPlayer())
    let blocks = winningMoves(arr)
    if (blocks.length) {
      play(blocks[getRandomInt(0, blocks.length)])
      changeTurn()
      return
    }
    let legal = legalMoves(board)
    play(legal[getRandomInt(0, legal.length)])
    if (checkForWin()) {
      gameOver = true
      log(currentPlayer.name, 'wins!!!')
    } else if (checkForDraw()) {
      log('Draw!')
    } else
      changeTurn()
  }
}

// Events
squares.forEach(el => el.onclick = moveLoop)

// initialize
function init() {
  try {
    let legal = legalMoves(board)
    play(legal[getRandomInt(0, legal.length)])
    changeTurn()
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
