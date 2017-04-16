import log, {hookConsoleLog} from 'stacklogger'
import classNames from 'classnames'
import moment from 'moment'
import 'moment-duration-format'
import Overtimer from 'overtimer'

// Model

// View

// Controller

// Events

// initialize
function init() {
  try {
    console.log('play tic-tac-toe')
  } catch (e) {
    log(e)
  }
}

hookConsoleLog()
init()
