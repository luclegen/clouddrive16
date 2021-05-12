import './App.sass'
import { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from './components/Header'
import Home from './components/Home'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <Route path="/" component={Home} />
      </Router>
    )
  }
}