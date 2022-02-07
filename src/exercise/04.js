// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
function useLocalStorageState({
  defaultValue = '',
  key,
  options = {serialize: JSON.stringify, deserailize: JSON.parse},
}) {
  const [state, setState] = React.useState(() =>
    window.localStorage.getItem(key)
      ? options.deserailize(window.localStorage.getItem(key))
      : typeof defaultValue === 'function'
      ? defaultValue()
      : defaultValue,
  )
  const prevKey = React.useRef(key)
  console.log({prev: prevKey.current, key})
  if (prevKey.current !== key) window.localStorage.removeItem(prevKey.current)
  React.useEffect(() => {
    window.localStorage.setItem(key, options.serialize(state))
  }, [key, options, options.serialize, state])
  return [state, setState]
}
function Board() {
  // 🐨 squares is the state for this component. Add useState for squares
  // const [squares, setSquares] = React.useState(
  //   () => JSON.parse(localStorage.getItem('squares')) || Array(9).fill(null),
  // )
  const [squares, setSquares] = useLocalStorageState({
    defaultValue: Array(9).fill(null),
    key: 'squares',
  })
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squareCopy = [...squares]
    squareCopy[square] = nextValue
    setSquares(squareCopy)
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    //
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    //
    // 🐨 set the squares to your copy
  }

  function restart() {
    setSquares(Array(9).fill(null))
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
