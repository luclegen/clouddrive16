import { Component } from 'react'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.setKeyword = this.setKeyword.bind(this)

    this.state = {
      isHover: false,
      selected: false,
      opened: false,
      keyword: ''
    }
  }

  toggle = () => this.setState({isHover: !this.state.isHover})

  getSearchBar = () => document.querySelector('.search-bar')
  getSearchIn = () => document.querySelector('.search-in')
  getSearchBtn = () => document.querySelector('.search-btn')

  open = () => {
    if (window.innerWidth < 801) {
      this.getSearchBar().style.position = 'absolute'
      this.getSearchBar().style.width = '100%'
      this.getSearchBar().style.left = '0'
      this.getSearchBar().style.background = 'white'
      this.getSearchIn().style.display = 'block'
      this.getSearchBtn().style.color = 'blue'
      this.getSearchIn().focus()
      setTimeout(() => this.setState({opened: true}));
    }
  }

  coloring = e => {
    if (e.type === 'select') this.setState({selected: true})
    if (e.type === 'blur') this.setState({selected: false})
    
    if (window.innerWidth > 800) {
      let color = this.state.keyword || this.state.selected || e.type === 'mouseenter' ? 'white' : '#e1dfdd'

      if (e.type === 'select') color = 'white'
      if (e.type === 'blur' && !this.state.keyword) color = '#e1dfdd'
      document.querySelector('.search-bar').style.background = color
    } else {
      if (e.type === 'mouseleave') {
        this.getSearchBar().style.width = 'auto'
        this.getSearchBar().style.position = 'static'
        this.getSearchBar().style.background = 'blue'
        this.getSearchBtn().style.color = 'white'
        this.getSearchIn().style.display = 'none'
        this.setState({opened: false})
      }
    }
  }

  setKeyword = e => this.setState({keyword: e.target.value})

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
              <button className="search-btn" type={window.innerWidth > 800 ? 'submit' : this.state.opened && this.state.keyword ? 'submit' : 'button'} disabled={window.innerWidth > 800 && !this.state.keyword} onClick={this.open}>
                <i className="material-icons">search</i>
              </button>
              <input className="search-in" type="search" placeholder="Search for anything" onSelect={this.coloring} onBlur={this.coloring} onInput={this.setKeyword} />
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