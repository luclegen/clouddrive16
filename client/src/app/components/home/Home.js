import { Component } from 'react'
import Login from './auth/Login'
import Activate from './auth/Activate'
import helper from '../../services/helper'

export default class Home extends Component {

  render = () => <main>
    {helper.loggedIn() ? helper.getPayload().activated ? <section>Home</section> : <Activate /> : <Login />}
  </main>
}