import { Component } from 'react'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.setKeyword = this.setKeyword.bind(this)

    this.state = {
      isHover: false,
      selected: false,
      opened: false,
      keyword: '',
      width: window.innerWidth,
    }
  }

  toggle = () => this.setState({ isHover: !this.state.isHover })

  getSearchBar = () => document.querySelector('.search-bar')
  getSearchIn = () => document.querySelector('.input-search')
  getSearchBtn = () => document.querySelector('.btn-search')

  open = () => {
    if (this.state.width < 801) {
      this.getSearchBar().style.position = 'absolute'
      this.getSearchBar().style.width = '100%'
      this.getSearchBar().style.left = '0'
      this.getSearchBar().style.background = 'white'
      this.getSearchIn().style.display = 'block'
      this.getSearchIn().focus()
      this.getSearchBtn().style.color = 'blue'
      setTimeout(() => this.setState({ opened: true }))
    }
  }

  reset = (isMobile = true) => {
    this.getSearchBar().style.width = isMobile ? 'auto' : (this.state.width < 1025 ? 250 : 500) + 'px'
    this.getSearchBar().style.position = 'static'
    this.getSearchBar().style.background = isMobile ? 'blue' : '#e1dfdd'
    this.getSearchBtn().style.color = isMobile ? 'white' : 'blue'
    this.getSearchIn().style.display = isMobile ? 'none' : 'flex'
  }

  coloring = e => {
    if (e.type === 'select') this.setState({ selected: true })
    if (e.type === 'blur') this.setState({ selected: false })

    if (this.state.width > 800) {
      let color = this.state.keyword || this.state.selected || e.type === 'mouseenter' ? 'white' : '#e1dfdd'

      if (e.type === 'select') color = 'white'
      if (e.type === 'blur' && !this.state.keyword) color = '#e1dfdd'
      document.querySelector('.search-bar').style.background = color
    } else if (e.type === 'mouseleave') {
      this.reset()
      this.setState({ opened: false })
    }
  }

  setKeyword = e => this.setState({ keyword: e.target.value })

  componentDidMount = () => window.onresize = () => {
    this.setState({ width: window.innerWidth })
    this.reset(this.state.width < 801)
    if (this.state.opened) this.open()
  }

  render = () => <header>
    <a className="logo" href="/" onMouseEnter={this.toggle} onMouseLeave={this.toggle}>
      <img className={`logo-img ${this.state.width > 560 && 'mr-1'}`} src={'logo' + (this.state.isHover ? '.hover' : '') + '.png'} alt="Logo" />
      {this.state.width > 560 && process.env.REACT_APP_CLIENT_NAME}
    </a>
    <div className="search-bar" onMouseEnter={this.coloring} onMouseLeave={this.coloring}>
      <form className="form-search">
        <button className="btn-search" type={this.state.width > 800 ? 'submit' : this.state.opened && this.state.keyword ? 'submit' : 'button'} disabled={this.state.width > 800 && !this.state.keyword} onClick={this.open}>
          <i className="material-icons">search</i>
        </button>
        <input className="input-search" type="search" placeholder="Search for anything" onSelect={this.coloring} onBlur={this.coloring} onInput={this.setKeyword} />
      </form>
    </div>
    <a href="/" className="avatar">
      <img className="avatar-img" src="https://lh3.googleusercontent.com/ogw/ADGmqu80fLiAIwlesuv_8mPJR4eMNwocFkqj4Cz8vcHj=s83-c-mo" alt="'s avatar" />
    </a>
  </header>
}