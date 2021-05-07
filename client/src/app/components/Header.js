import { Component } from 'react'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isHover: false
    }
  }

  render() {
    return (
      <header>
        <nav>
          <a className="logo" href="/" onMouseEnter={this.toggle} onMouseLeave={this.toggle}>
            <img src={'logo' + (this.state.isHover ? '.hover' : '') + '.png'} alt="Logo" />
            {process.env.REACT_APP_CLIENT_NAME}
          </a>
        </nav>
      </header>
    )
  }
}