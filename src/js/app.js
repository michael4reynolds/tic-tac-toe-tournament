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
const board = new Array(9).fill('')

// View
const squares = Array.from(document.querySelectorAll('.game span'))

// Utilities
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const delay = amount => new Promise(resolve => setTimeout(() => resolve(), amount))

// Controller
let startWait = () => waiting = true
let endWait = () => waiting = false

let wait = async (amount) => {
  startWait()
  await delay(amount)
  endWait()
}

const nextPlayer = () => currentPlayer === player1 ? player2 : player1
const changeTurn = () => currentPlayer = nextPlayer()

const legalMoves = arr => arr.reduce((a, e, i) => {
  if (e === '') a.push(i)
  return a
}, [])

const checkForWin = () => combos.some(c =>
  c.every(i => board[i] === currentPlayer.mark))

const checkForDraw = () => moveCount === 9

let checkGameOver = () => {
  let over = true
  if (checkForWin()) {
    log(currentPlayer.name, 'wins!!!')
  } else if (checkForDraw()) {
    log('Draw!')
  } else {
    over = false
  }
  return over
}

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

const play = square => {
  document.getElementById(`box-${square}`).innerText = currentPlayer.mark
  board[square] = currentPlayer.mark
  moveCount++
  gameOver = checkGameOver()
  if (!gameOver) changeTurn()
}

let moveRandom = () => {
  let legal = legalMoves(board)
  play(legal[getRandomInt(0, legal.length)])
}

const aiPlay = async () => {
  await wait(1200)
  let arr = twoSquaresDone(currentPlayer)
  let winners = winningMoves(arr)
  if (winners.length) {
    play(winners[getRandomInt(0, winners.length)])
    log(currentPlayer.name, 'wins!!!')
  } else {
    arr = twoSquaresDone(nextPlayer())
    let blocks = winningMoves(arr)
    if (blocks.length) {
      play(blocks[getRandomInt(0, blocks.length)])
    } else {
      moveRandom()
    }
  }
}

const startNewGame = () => {
  board.fill('')
  squares.forEach(el => el.innerText = '')
  currentPlayer = player1
  moveCount = 0
  gameOver = false
  wait(600).then(() => moveRandom())
}

const moveLoop = async e => {
  if (gameOver) {
    await startNewGame()
    return
  }
  if (e.target.innerText || waiting) return
  play(e.target.id.split('-')[1])
  if (!gameOver) {
    await aiPlay()
  }
}

// Events
squares.forEach(el => el.onclick = moveLoop)

// initialize
function init() {
  try {
    startNewGame()
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
