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
      folder: { _id: 'root', path: '/', name: 'root' },
      folders: [],
      items: []
    }
  }

  getURLSearchParams = () => (new URLSearchParams(window.location.search))

  getQueryStringParameter = (name) => (new URLSearchParams(window.location.search)).get(name)

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

  open = e => {
    const folder = this.state.folders.find(f => f._id === e.target.closest('.li-folder').id)
    this.setState({ path: (this.state.path === '/' ? this.state.path : this.state.path + '/') + folder.name })
    this.setQueryStringParameter('id', folder._id)
  }

  access = e => {
    const index = Number.parseInt(e.target.id)
    const path = index === 1 ? '/' : this.state.path.split('/').slice(0, index).join('/')
    const folder = this.state.folders.find(f => f.path === path)
    this.setState({ path: path ? path : '/' })
    this.setQueryStringParameter('id', Number.parseInt(e.target.id) === 0 ? 'root' : folder._id)
  }

  componentDidMount = () => {
    if (helper.loggedIn()) {
      userService.read()
        .then(res => this.setState({ fullName: res.data.user.fullName }))
    }
    if (!window.location.search) window.location.search = 'id=root'
  }

  componentDidUpdate = () => {
    foldersService.read()
      .then(res => {
        const folder = this.getQueryStringParameter('id') === 'root' ? { path: '/', name: '' } : res.data.folders.find(f => f._id === this.getQueryStringParameter('id'))
        const path = folder.name === '' ? '/' : folder.path === '/' ? folder.path + folder.name : folder.path + '/' + folder.name
        this.setState({ folders: res.data.folders, items: res.data.folders.filter(f => f.path === path), path: path })
      })
  }

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
        {this.state.path === '/' ? <strong>My files</strong> : this.state.path.split('/').map((v, i, a) => <div key={i}>{i === 0 ? <div className="dir"><p className="dir-parent" id={i} onClick={this.access}>My files</p><p>&nbsp;&gt;&nbsp;</p></div> : i === a.length - 1 ? <p><strong>{v}</strong></p> : <div className="dir"><p className="dir-parent" id={i} onClick={this.access}>{v}</p><p>&nbsp;&gt;&nbsp;</p></div>}</div>)}
      </div>
      <ul className="ls-folder">
        {this.state.items.map((v, i, a) => a.length ? <li className="li-folder" key={i} id={v._id} onClick={this.open}>
          <img className="bg-folder" src="svg/lg-bg.svg" alt="background folder" />
          <div className="pad-folder"></div>
          {/* <img className="fg-folder" src="svg/lg-fg-media.svg" alt="forceground folder" /> */}
          <img className="fg-folder" src="svg/lg-fg.svg" alt="forceground folder" />
          <label className="label-folder" htmlFor={`folder${i}`}>{v.name}</label>
        </li> : <li>This folder is empty</li>)}
      </ul>
    </div>
  </section>
}