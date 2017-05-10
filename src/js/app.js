import log, {hookConsoleLog} from 'stacklogger'

// Model
const player = (name, mark) => ({name, mark})
let player1
let player2
let currentPlayer
let moveCount = 0
let waiting = false
let gameOver = false
let score = {computer: 0, human: 0, tie: 0}
const combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]]
const board = new Array(9).fill('')

// View
const formSettings = document.getElementById('settings')
const squares = Array.from(document.querySelectorAll('.game span'))
const inputs = Array.from(document.querySelectorAll('input'))
const lblPlayer = document.getElementById('player-label')
const p1Stats = document.getElementById('p1-wins')
const ties = document.getElementById('ties')
const p2Stats = document.getElementById('p2-wins')

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

const displayStats = () => {
  p1Stats.innerText = score.human
  p2Stats.innerText = score.computer
  ties.innerText = score.tie
}

let lastBoard = 0
const checkForWin = () => combos.some((c, ci) => {
  lastBoard = ci
  return c.every(i => board[i] === currentPlayer.mark)
})

const checkForDraw = () => moveCount === 9

const highlightWin = i => combos[i].forEach(c => squares[c].classList.add('winner'))

let checkGameOver = () => {
  log(currentPlayer)
  let over = true
  if (checkForWin()) {
    highlightWin(lastBoard)
    if (currentPlayer.name === 'computer') {
      score.computer++
    } else {
      score.human++
    }
    displayStats()
  } else if (checkForDraw()) {
    score.tie++
    displayStats()
    log(score)
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
    displayStats()
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

const applyGameSettings = () => {
  let mark = document.querySelector('[name=mark]:checked').value
  player1 = player(document.getElementById('name').value, mark === 'X' ? 'X' : 'O')
  player2 = player('computer', mark === 'X' ? 'O' : 'X')

  lblPlayer.innerText = player1.name
}

const startNewGame = () => {
  board.fill('')
  squares.forEach(el => {
    el.innerText = ''
    el.classList.remove('winner')
  })
  currentPlayer = document.querySelector('[name=mark]:checked').value === 'X' ? player1 : player2
  moveCount = 0
  gameOver = false
  if (document.querySelector('[name=mark]:checked').value === 'X') return
  wait(600).then(() => moveRandom())
}

const moveLoop = async e => {
  if (gameOver) {
    applyGameSettings()
    await startNewGame()
    return
  }
  if (e.target.innerText || waiting) return
  play(e.target.id.split('-')[1])
  if (!gameOver) {
    await aiPlay()
  }
}

const changeSettings = () => {
  applyGameSettings()
  startNewGame()
}

// Events
squares.forEach(el => el.onclick = moveLoop)
inputs.forEach(el => el.onchange = changeSettings)
formSettings.addEventListener('submit', e => e.preventDefault())

// initialize
function init() {
  try {
    applyGameSettings()
    startNewGame()
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
