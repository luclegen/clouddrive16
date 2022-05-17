import { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import helper from '../../services/helper'
import authService from '../../services/auth'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.setKeyword = this.setKeyword.bind(this)

    this.state = {
      avatar: '',
      isHover: false,
      selected: false,
      opened: false,
      keyword: '',
      width: window.innerWidth,
      dropdownOpened: false
    }
  }

  toggle = () => this.setState({ isHover: !this.state.isHover })

  toggleDropdown = () => this.setState({ dropdownOpened: !this.state.dropdownOpened })

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
      this.setState({ opened: true })
    }
  }

  reset = (mobile = true) => {
    this.getSearchBar().style.width = mobile ? 'auto' : (this.state.width < 1025 ? 250 : 500) + 'px'
    this.getSearchBar().style.position = 'static'
    this.getSearchBar().style.background = mobile ? 'blue' : '#e1dfdd'
    this.getSearchBtn().style.color = mobile ? 'white' : 'blue'
    this.getSearchIn().style.display = mobile ? 'none' : 'flex'
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

  logout = () => authService.logout().then(() => window.location.href = '/')

  componentDidUpdate = () => window.onresize = () => {
    this.setState({ width: window.innerWidth })
    this.reset(this.state.width < 801)
    if (this.state.opened) this.open()
  }

  render = () => <header>
    <a className="logo" href="/" onMouseEnter={this.toggle} onMouseLeave={this.toggle}>
      <img className={`logo-img ${this.state.width > 560 && 'mr-1'}`} src="logo.svg" alt="Logo" hidden={this.state.isHover} />
      <img className={`logo-img ${this.state.width > 560 && 'mr-1'}`} src="logo.hover.svg" alt="Hover logo" hidden={!this.state.isHover} />
      {this.state.width > 560 && process.env.REACT_APP_NAME}
    </a>
    <div className="search-bar" onMouseEnter={this.coloring} onMouseLeave={this.coloring}>
      <form className="form-search">
        <button className="btn-search" type={this.state.width > 800 ? 'submit' : this.state.opened && this.state.keyword ? 'submit' : 'button'} disabled={this.state.width > 800 && !this.state.keyword} onClick={this.open}>
          <i className="material-icons">search</i>
        </button>
        <input className="input-search" type="search" placeholder="Search for anything" onSelect={this.coloring} onBlur={this.coloring} onInput={this.setKeyword} />
      </form>
    </div>
    <Dropdown className="dropdown-avatar" isOpen={this.state.dropdownOpened} toggle={this.toggleDropdown}>
      {helper.isLogin() ? <DropdownToggle className="avatar" title={helper.getCookie('firstName')}>{this.state.avatar ? <img className="avatar-img" src={this.state.avatar} alt={`${this.state.firstName}'s avatar`} /> : this.state.role === 'root' ? <i className="material-icons">security</i> : this.state.role === 'admin' ? <i className="material-icons">local_police</i> : <i className="material-icons">account_circle</i>}</DropdownToggle> : <a className="link-help" href="/help" target="_blank"><i className="material-icons">help_outline</i></a>}
      <DropdownMenu className="dropdown-menu-avatar">
        <DropdownItem className="dropdown-item-profile" tag="a" href="/profile"><p className="text-profile">My profile</p><i className="material-icons">info</i></DropdownItem>
        <DropdownItem divider />
        <DropdownItem className="dropdown-item-profile" tag="a" href="/help"><p className="text-help">Help</p><i className="material-icons">help_outline</i></DropdownItem>
        <DropdownItem divider />
        <DropdownItem className="dropdown-item-logout" onClick={this.logout}><p className="text-logout">Sign out</p><i className="material-icons">logout</i></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </header>
}