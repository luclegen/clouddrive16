import { Component } from 'react'
import Login from '../auth/Login'
import Activate from '../auth/Activate'
import Files from './Files'
import helper from '../../services/helper'

export default class Home extends Component {
  render = () => <main>
    {helper.isLogin() ? helper.getCookie('is_activate') === 'true' ? <Files /> : <Activate /> : <Login />}
  </main>
}