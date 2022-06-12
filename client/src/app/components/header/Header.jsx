import { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import helper from '../../services/helper'
import authService from '../../services/auth'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      avatar: '',
      folders: [],
      foundFolders: [],
      foundFiles: [],
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

  setValue = e => this.setState({ keyword: e.target.value })

  logout = () => authService.logout().then(() => window.location.href = '/')

  search = e => e.target.value
    ? foldersService.list(e.target.value)
      .then(res => new Promise(resolve => this.setState({ foundFolders: res.data }) || resolve())
        .then(() => filesService.list(e.target.value)
          .then(res => this.setState({ foundFiles: res.data }))))
    : this.setState({ foundFolders: [], foundFiles: [] })

  access = e => /folder/g.test(e.target.className)
    ? (window.location.href = `?id=${e.target.id}`)
    : /file/g.test(e.target.className)
    && (window.location.href = `?id=${e.target.value === '/' ? 'root' : this.state.folders.find(v => v.path + (v.path === '/' ? '' : '/') + v.name === e.target.value)._id}${helper.isMedia(e.target.name) ? `&fid=${e.target.id}` : ''}`)
    && helper.isPDF(e.target.name)
    && window.open(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${e.target.value === '/' ? '/' : e.target.value + '/'}${e.target.name}`)

  componentDidMount = () => foldersService.list()
    .then(res => this.setState({ folders: res.data }))

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
    <div className="search-bar" onMouseEnter={this.coloring} onMouseLeave={this.coloring} onInput={this.search}>
      <form className="form-search">
        <button className="btn-search" type={this.state.width > 800 ? 'submit' : this.state.opened && this.state.keyword ? 'submit' : 'button'} disabled={this.state.width > 800 && !this.state.keyword} onClick={this.open}>
          <i className="material-icons">search</i>
        </button>
        <input className="input-search" type="search" placeholder="Search for anything" onSelect={this.coloring} onBlur={this.coloring} onInput={this.setValue} />
      </form>
      <div className="list-group-search">
        {this.state.foundFolders?.map((v, i) => <button type="button" className="list-group-item-folder" id={v._id} key={i} onClick={this.access}>
          <img className="folder" src="/svg/folder.svg" alt="Folder" /> &nbsp;&nbsp;{v.name}
        </button>)}
        {this.state.foundFiles?.map((v, i) => <button type="button" className="list-group-item-file" id={v._id} key={i} name={v.name} value={v.path} onClick={this.access}>
          <i className="material-icons">{helper.isImage(v.name) ? 'image' : helper.isVideo(v.name) ? 'video_file' : helper.isAudio(v.name) ? 'audio_file' : 'description'}</i>&nbsp;&nbsp;{v.name}
        </button>)}
      </div>
    </div>
    <Dropdown className="dropdown-avatar" isOpen={this.state.dropdownOpened} toggle={this.toggleDropdown}>
      {helper.isLogin() ? <DropdownToggle className="avatar" title={helper.getCookie('first_name')}>{this.state.avatar ? <img className="avatar-img" src={this.state.avatar} alt={`${this.state.first_name}'s avatar`} /> : this.state.role === 'root' ? <i className="material-icons">security</i> : this.state.role === 'admin' ? <i className="material-icons">local_police</i> : <i className="material-icons">account_circle</i>}</DropdownToggle> : <a className="link-help" href="/help" target="_blank"><i className="material-icons">help_outline</i></a>}
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