import './App.sass'

const App = () => {
  return (
    <div className="App">
      Hello {process.env.REACT_APP_CLIENT_NAME}!
    </div>
  )
}

export default App
