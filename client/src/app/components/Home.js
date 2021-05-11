import { Component } from 'react'
import Login from './Login'

export default class Home extends Component {

  render = () => <main>
    {true && <Login />}
  </main>
}