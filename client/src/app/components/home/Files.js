import { Component } from 'react'
import helper from '../../services/helper'
import userService from '../../services/user'
import folderService from '../../services/folder'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

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
      items: [],
      file: null,
      ready: false,
      files: [],
      itemFiles: [],
    }
  }

  return = () => {
    helper.deleteQuery('location')
    this.setState({ location: '' })
  }

  setTrash = () => {
    helper.setQuery('location', 'trash')
    this.setState({ location: 'trash' })
  }

  save = e => {
    const formData = new FormData()
    const names = []

    formData.append("path", this.state.path)
    Array.from(e.target.files).forEach(file => names.push(file.name) && formData.append("files", file, file.name))
    formData.append("names", JSON.stringify(names))

    filesService.create(formData)
  }

  upload = () => document.getElementById("files").click()

  download = () => window.location.href = process.env.REACT_APP_FILE_URI + helper.getId()

  create = () => folderService.create({ name: prompt('Folder', 'New folder'), path: this.state.path })

  open = e => {
    const folder = this.state.folders.find(f => f._id === e.target.closest('.li-folder').id)
    this.setState({ path: (this.state.path === '/' ? this.state.path : this.state.path + '/') + folder.name })
    helper.setQuery('id', folder._id)
  }

  rename = () => {
    helper.getType() === 'folder' &&
      folderService.read(helper.getId())
        .then(res => folderService.update(helper.getId(), { name: prompt('Folder', res.data.folder.name) }))
  }

  delete = () => {
    helper.getType() === 'folder' &&
      folderService.delete(helper.getId())
  }

  restore = () => {
    helper.getType() === 'folder' &&
      folderService.restore(helper.getId())
  }

  choose = e => {
    e.preventDefault()

    this.getMenuFolder().style.display = 'block'
    this.getMenuFolder().style.top = `${e.clientY}px`
    this.getMenuFolder().style.left = `${e.clientX}px`
    helper.setId(e.target.closest((/file/g).test(e.target.className) ? '.li-file' : (/folder/g).test(e.target.className) ? '.li-folder' : null).id)
    helper.setType((/file/g).test(e.target.className) ? 'file' : (/folder/g).test(e.target.className) ? 'folder' : null)

    document.querySelector('.dropdown-item-dowload').style.setProperty('display', (/folder/g).test(e.target.className) ? 'none' : 'flex', 'important')
  }

  clickOut = e => this.getMenuFolder().style.display = 'none'

  getMenuFolder = () => document.querySelector('.dropdown-menu-folder')

  access = e => {
    const index = Number.parseInt(e.target.id)
    const path = index === 1 ? '/' : this.state.path.split('/').slice(0, index).join('/')
    const folder = this.state.folders.find(f => f.path === path)
    this.setState({ path: path ? path : '/' })
    helper.setQuery('id', Number.parseInt(e.target.id) === 0 ? 'root' : folder._id)
  }

  componentDidMount = () => {
    if (helper.loggedIn())
      userService.read()
        .then(res => this.setState({ fullName: res.data.user.fullName }))
    if (!window.location.search) window.location.search = 'id=root'
  }

  componentDidUpdate = () => {
    foldersService.read()
      .then(res => {
        const folders = res.data.folders.filter(f => helper.getQuery('location') === 'trash' ? f.inTrash : !f.inTrash)
        const folder = helper.getQuery('id') === 'root' ? { path: '/', name: '' } : res.data.folders.find(f => f._id === helper.getQuery('id'))
        const path = folder.name === '' ? '/' : folder.path === '/' ? folder.path + folder.name : folder.path + '/' + folder.name

        this.setState({ folders: folders, items: folders.filter(f => f.path === path), path: path })
        filesService.read()
          .then(res => {
            const files = res.data.files.filter(f => helper.getQuery('location') === 'trash' ? f.inTrash : !f.inTrash)
            this.setState({ files: files, itemFiles: files.filter(f => f.path === path) })
          })
      })
  }

  render = () => <section className="section-files" onClick={this.clickOut} >
    <ul className="dropdown-menu-folder">
      <li className="dropdown-item-dowload" onClick={this.download}><i className="material-icons">file_download</i>Download</li>
      <li className="dropdown-item-rename" onClick={this.rename}><i className="material-icons">drive_file_rename_outline</i>Rename</li>
      {helper.getQuery('location') === 'trash' && <li className="dropdown-item-restore" onClick={this.restore}><i className="material-icons">restore</i>Restore</li>}
      <li className="dropdown-item-delete" onClick={this.delete}><i className="material-icons">delete</i>Delete</li>
    </ul>
    <nav className="left-nav col-2" id="leftNav">
      <div className="top-left-nav">
        <label htmlFor="leftNav"><strong>{this.state.fullName}</strong></label>
      </div>
      <ul className="list-group">
        <li className={`list-group-item-files ${!this.state.location && 'active'}`} onClick={this.return}><i className="material-icons">folder</i> My files</li>
        <li className={`list-group-item-trash ${this.state.location === 'trash' && 'active'}`} onClick={this.setTrash}><i className="material-icons">delete</i> Trash</li>
      </ul>
    </nav>
    <div className="right-content col-10">
      <div className="command-bar shadow-sm">
        <button className="btn-new-folder" onClick={this.create}><i className="material-icons">create_new_folder</i> New</button>
        <input type="file" id="files" hidden onChange={this.save} multiple />
        <button className="btn-new-folder" onClick={this.upload}><i className="material-icons">publish</i> Upload</button>
      </div>
      <div className="path-bar">
        {this.state.path === '/' ? <strong>My files</strong> : this.state.path.split('/').map((v, i, a) => <div key={i}>{i === 0 ? <div className="dir"><p className="dir-parent" id={i} onClick={this.access}>My files</p><p>&nbsp;&gt;&nbsp;</p></div> : i === a.length - 1 ? <p><strong>{v}</strong></p> : <div className="dir"><p className="dir-parent" id={i} onClick={this.access}>{v}</p><p>&nbsp;&gt;&nbsp;</p></div>}</div>)}
      </div>
      <ul className="ls-folder">
        {this.state.items.map((v, i, a) => a.length ? <li className="li-folder" key={i} id={v._id} onClick={this.open} onContextMenu={this.choose}>
          <img className="bg-folder" src="svg/lg-bg.svg" alt="background folder" />
          {helper.isImages(this.state.files, v) ? <img className="img" src={`${process.env.REACT_APP_IMAGES_URI}${helper.getPayload()._id}/files/${helper.getImage(this.state.files, v).path}/${helper.getImage(this.state.files, v).name}`} alt="forceground folder" /> : <div className="file"></div>}
          {helper.isImages(this.state.files, v) ? <img className="fg-folder" src="svg/lg-fg-media.svg" alt="forceground folder" onContextMenu={this.choose} /> : <img className="fg-folder" src="svg/lg-fg.svg" alt="forceground folder" />}
          <label className="label-folder" htmlFor={`folder${i}`}>{v.name}</label>
        </li> : <li>This folder is empty</li>)}
        {this.state.itemFiles.map((v, i, a) => <li className="li-file" key={i} id={v._id} onContextMenu={this.choose}>
          {helper.isImage(v.name) ? <img className="bg-img" src={`${process.env.REACT_APP_IMAGES_URI}${helper.getPayload()._id}/files/${v.path}/${v.name}`} alt={`Img ${i}`} /> : <i className="material-icons bg-file">description</i>}
          <label className="label-file" htmlFor={`folder${i}`}>{v.name}</label>
        </li>)}
      </ul>
    </div>
  </section>
}