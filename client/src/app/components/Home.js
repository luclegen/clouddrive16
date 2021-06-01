import { Component } from 'react'
import Login from './Login'
import Activate from './Activate'
import helper from '../services/helper'

export default class Home extends Component {

  render = () => <main>
    {helper.loggedIn() ? helper.getPayload().activated ? <section>Home</section> : <Activate /> : <Login />}
  </main>
}