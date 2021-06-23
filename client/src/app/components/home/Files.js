import { Component } from 'react'
import helper from '../../services/helper'
import userService from '../../services/user'
import folderService from '../../services/folder'
import foldersService from '../../services/folders'

export default class Files extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: '',
      location: '',
      opened: false,
      path: '/',
      name: '',
      folders: []
    }
  }

  getURLSearchParams = () => new URLSearchParams(window.location.search)

  setQueryStringParameter = (name, value) => {
    const params = new URLSearchParams(window.location.search)
    params.set(name, value)
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  deleteQueryStringParameter = name => {
    const params = new URLSearchParams(window.location.search)
    params.delete(name)
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  setFiles = () => {
    this.deleteQueryStringParameter('location')
    this.setState({ location: '' })
  }

  setTrash = () => {
    this.setQueryStringParameter('location', 'trash')
    this.setState({ location: 'trash' })
  }

  setFolder = () => {
    let name = ''
    do {
      name = prompt('Folder', 'New folder')
      if (name === "") alert('Folder is required.')
    } while (name !== null && name === "")
    folderService.create({ name: name, path: this.state.path })
  }

  componentDidMount = () => {
    if (helper.loggedIn()) {
      userService.read()
        .then(res => this.setState({ fullName: res.data.user.fullName }))
    }
    if (!window.location.search) window.location.search = 'id=root'
  }

  componentDidUpdate = () =>
    foldersService.read()
      .then(res => this.setState({ folders: res.data.folders }))

  render = () => <section className="section-files">
    <nav className="left-nav col-2" id="leftNav">
      <div className="top-left-nav">
        <label htmlFor="leftNav"><strong>{this.state.fullName}</strong></label>
      </div>
      <ul className="list-group">
        <li className={`list-group-item-files ${!this.state.location && 'active'}`} onClick={this.setFiles}><i className="material-icons">folder</i> My files</li>
        <li className={`list-group-item-trash ${this.state.location === 'trash' && 'active'}`} onClick={this.setTrash}><i className="material-icons">delete</i> Trash</li>
      </ul>
    </nav>
    <div className="right-content col-10">
      <div className="command-bar shadow-sm">
        <button className="btn-new-folder" onClick={this.setFolder}><i className="material-icons">create_new_folder</i> New</button>
      </div>
      <div className="path-bar">
        <strong>{`My files${this.state.path === '/' ? '' : this.state.path}`}</strong>
      </div>
      <ul className="ls-folder">
        {this.state.folders.map((v, i) => <li className="li-folder" key={i} id={`folder${i}`}>
          <img className="bg-folder" src="svg/lg-bg.svg" alt="background folder" />
          <div className="pad-folder"></div>
          {/* <img className="fg-folder" src="svg/lg-fg-media.svg" alt="forceground folder" /> */}
          <img className="fg-folder" src="svg/lg-fg.svg" alt="forceground folder" />
          <label className="label-folder" htmlFor={`folder${i}`}>{v.name}</label>
        </li>)}
      </ul>
    </div>
  </section>
}