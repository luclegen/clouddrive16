import './App.sass'
import { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from './components/header/Header'
import Home from './components/home/Home'
import FindAccount from './components/others/FindAccount'

export default class App extends Component {
  render = () => <Router>
    <Header />
    <Route exact path="/" component={Home} />
    <Route path="/find-account" component={FindAccount} />
  </Router>
}