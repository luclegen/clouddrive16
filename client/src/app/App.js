import './App.sass'
import { Component } from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Footer from './components/Footer/Footer'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <Route path="/" component={Home} />
        <Footer />
      </Router>
    )
  }
}