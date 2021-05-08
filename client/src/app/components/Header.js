import { Component } from 'react'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isHover: false
    }
  }

  toggle = () => this.setState({isHover: !this.state.isHover})

  render() {
    return (
      <header>
        <nav className="navbar">
          <a className="logo" href="/" onMouseEnter={this.toggle} onMouseLeave={this.toggle}>
            <img className="logo-img" src={'logo' + (this.state.isHover ? '.hover' : '') + '.png'} alt="Logo" />
            {process.env.REACT_APP_CLIENT_NAME}
          </a>
          <div className="search-bar">
            <form className="search-form">
              <button className="search-btn" type="button">
                <i className="material-icons">search</i>
              </button>
              <input className="search-in" type="search" placeholder="Search for anything" />
            </form>
          </div>
          <a href="/" className="avatar">
            <img className="avatar-img" src="https://lh3.googleusercontent.com/ogw/ADGmqu80fLiAIwlesuv_8mPJR4eMNwocFkqj4Cz8vcHj=s83-c-mo" alt="'s avatar" />
          </a>
        </nav>
      </header>
    )
  }
}