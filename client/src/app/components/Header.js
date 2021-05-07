import { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <header>
        <nav>
          <a className="logo" href="/">
            <img src="logo.png" alt="Logo" />
            {process.env.REACT_APP_CLIENT_NAME}
          </a>
        </nav>
      </header>
    )
  }
}