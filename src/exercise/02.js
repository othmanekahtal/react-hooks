// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

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
function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState({
    defaultValue: initialName,
    key: 'name',
  })
  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      <button onClick={() => setCount(previousValue => ++previousValue)}>
        {count}
      </button>
      <Greeting />
    </>
  )
}

export default App
