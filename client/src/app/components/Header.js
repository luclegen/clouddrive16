import { Component } from 'react'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isHover: false,
      preEvent: null,
      selected: false
    }
  }

  toggle = () => this.setState({isHover: !this.state.isHover})

  select = () => document.querySelector('.search-bar').style.background = 'white'

  coloring = e => {
    if (e.type === 'select') this.setState({selected: true})
    if (e.type === 'blur') this.setState({selected: false})

    let color = this.state.selected ||
                (this.state.preEvent == null && e.type === 'mouseenter') ||
                (this.state.preEvent === 'mouseleave' && e.type === 'mouseenter') ||
                (this.state.preEvent === 'blur' && e.type === 'mouseenter')
                ? 'white' : '#e1dfdd'

    if (e.type === 'select') color = 'white'
    if (e.type === 'blur') color = '#e1dfdd'
    document.querySelector('.search-bar').style.background = color
    this.setState({preEvent: e.type})
  }

  blur = () => document.querySelector('.search-bar').style.background = '#e1dfdd'

  render() {
    return (
      <header>
        <nav className="navbar">
          <a className="logo" href="/" onMouseEnter={this.toggle} onMouseLeave={this.toggle}>
            <img className="logo-img" src={'logo' + (this.state.isHover ? '.hover' : '') + '.png'} alt="Logo" />
            {process.env.REACT_APP_CLIENT_NAME}
          </a>
          <div className="search-bar" onMouseEnter={this.coloring} onMouseLeave={this.coloring}>
            <form className="search-form">
              <button className="search-btn" type="button">
                <i className="material-icons">search</i>
              </button>
              <input className="search-in" type="search" placeholder="Search for anything" onSelect={this.coloring} onBlur={this.coloring} />
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