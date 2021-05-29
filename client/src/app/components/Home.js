import { Component } from 'react'
import Login from './Login'
import helper from '../services/helper'

export default class Home extends Component {

  render = () => <main>
    {!helper.loggedIn() && <Login />}
  </main>
}