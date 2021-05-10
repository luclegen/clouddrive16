import { Component } from 'react'
import SignIn from './SignIn'

export default class Home extends Component {

  render = () => <main>
    {true && <SignIn />}
  </main>
}