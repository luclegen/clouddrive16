import React, { Component } from 'react'
import helper from '../../services/helper'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

export default class FolderTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldFolders: [],
      folders: [],
      showedFolders: [],
      new: false,
      id: 'TRoot',
      name: '',
    }
  }

  select = e => {
    document.querySelectorAll('.list-group-item')
      .forEach(v => v?.classList.contains('active')
        && v?.classList.remove('active'))

    e.target.closest('button')?.classList.add('active')

    e.target.closest('button')?.classList.contains('open')
      ? this.close(e.target.closest('button').id)
      : this.open(e.target.closest('button').id)

    this.setState({ new: false, id: e.target.closest('button').id })
  }

  open = id => {
    const target = document.querySelector(`#${id}`)

    if (id === 'TRoot') {
      this.setState({ showedFolders: this.state.folders.filter(v => v.path === '/') })

      !target.classList.contains('open')
        && target.classList.add('open')
    }
    else {
      const subfolders = this.state.folders.filter(f => f.path === helper.toPath(this.state.folders.find(v => v._id === id)))

      !this.state.showedFolders.some(v => subfolders.includes(v))
        && this.setState({ showedFolders: this.state.showedFolders.concat(subfolders) })

      subfolders.length
        && !target.classList.contains('open')
        && target.classList.add('open')
    }
  }

  close = id => {
    const target = document.querySelector(`#${id}`)

    if (id === 'TRoot') {
      this.setState({ showedFolders: [] })

      target.classList.contains('open')
        && target.classList.remove('open')
    }
    else {
      const subfolders = this.state.folders.filter(f => f.path === helper.toPath(this.state.folders.find(v => v._id === id)))

      this.state.showedFolders.some(v => subfolders.includes(v))
        && this.setState({ showedFolders: this.state.showedFolders.filter(v => !subfolders.some(s => new RegExp(s.path).test(v.path))) })

      subfolders.map(v => document.getElementById(v._id)?.classList.contains('open')
        && document.getElementById(v._id)?.classList.remove('open'))

      subfolders.length
        && target.classList.contains('open')
        && target.classList.remove('open')
    }
  }

  create = () => new Promise(resolve => this.setState({ new: true }) || resolve())
    .then(() => document.querySelector('#newFolder').focus())

  move = () => this.props.type === 'folder'
    ? foldersService.move(this.props.id, { did: this.state.id.slice(1) })
      .then(res => this.refresh()
        .then(() => this.props.close() || alert(res.data)))
    : filesService.move(this.props.id, { did: this.state.id.slice(1) })
      .then(res => this.refresh()
        .then(() => this.props.close() || alert(res.data)))

  copy = () => this.props.type === 'folder'
    ? foldersService.copy(this.props.id, { did: this.state.id.slice(1) })
      .then(res => this.refresh()
        .then(() => this.props.close() || alert(res.data)))
    : filesService.copy(this.props.id, { did: this.state.id.slice(1) })
      .then(res => this.refresh()
        .then(() => this.props.close() || alert(res.data)))

  submit = (e, target = this.state.showedFolders.find(v => v._id === this.state.id)) =>
    e.preventDefault() || foldersService.create({ name: this.state.name, path: target ? helper.toPath(target) : '/' })
      .then(() => this.setState({ oldFolders: this.state.folders }) || this.refresh()
        .then(() => this.setState({
          new: false,
          showedFolders: this.state.showedFolders
            .concat(this.state.folders
              .filter(v => this.state.oldFolders
                .every(o => o._id !== v._id)))
        })))

  refresh = () => foldersService.list()
    .then(res => this.props.refresh()
      .then(this.setState({ folders: res.data?.map(v => (v._id = `T${v._id}`) && v) })))

  componentDidMount = () => this.refresh()
    .then(() => this.setState({ showedFolders: this.state.folders.filter(v => v.path === '/') }))

  render = () => <section className="section-floating-aside">
    <div className="col-8"></div>
    <aside className="aside-right col-4">
      <span className="command-bar">
        <span className="primary-command">
          {this.props.action === 'move' && <button className="btn-move" onClick={this.move}><i className="material-icons">drive_file_move</i>Move</button>}
          {this.props.action === 'copy' && <button className="btn-copy" onClick={this.copy}><i className="material-icons">{this.props.type === 'folder' ? 'folder_copy' : 'file_copy'}</i>Copy</button>}
          <button className="btn-new-folder" onClick={this.create}><i className="material-icons">create_new_folder</i> New</button>
        </span>
        <span className="middle-command">
        </span>
        <span className="secondary-command">
          <button className="btn-close" type="button" onClick={this.props.close}><i className="material-icons">close</i></button>
        </span>
      </span>
      <main className="main-folder-tree">
        <div className="list-group">
          <div>
            <button type="button" className="list-group-item list-group-item-action active open" id="TRoot" value="/" onClick={this.select}>
              <i className="material-icons">{this.state.showedFolders.filter(v => helper.toPath(v)).length ? 'expand_more' : 'navigate_next'}</i>
              <img src="/logo.svg" alt="CloudDrive16 logo" width="30" onClick={this.toggle} />&nbsp;&nbsp;My files
            </button>
            {(this.state.new && this.state.id === 'TRoot') && <button type="button" className="list-group-item list-group-item-action" style={{ marginLeft: '40px' }}>
              <form className="form-horizontal" onSubmit={this.submit}>
                <img className="folder" src="/svg/folder.svg" alt="" />
                &nbsp;&nbsp;
                <input type="text" name="name" id="newFolder" placeholder="Enter your folder name" onChange={e => this.setState({ name: e.target.value })} />
                &nbsp;&nbsp;
                <input className="submit-create" type="submit" value="Create" />
              </form>
            </button>}
          </div>
          {this.state.showedFolders
            .sort((a, b) => helper.toPath(a) === helper.toPath(b) ? 0 : helper.toPath(a) < helper.toPath(b) ? -1 : 1)
            .map((v, i) => <div key={i}>
              <button type="button" className="list-group-item list-group-item-action" id={v._id} key={i} style={{ marginLeft: `${((helper.toPath(v).match(/\//g) || []).length - 1) * 40}px` }} onClick={this.select}>
                {!!this.state.folders.filter(s => s.path === helper.toPath(v)).length
                  ? <i className="material-icons">{this.state.showedFolders.filter(s => s.path === helper.toPath(v)).length ? 'expand_more' : 'navigate_next'}</i>
                  : <span style={{ width: '29px' }}></span>}
                <img className="folder" src="/svg/folder.svg" alt="" />&nbsp;&nbsp;{v.name}
              </button>
              {(this.state.new && this.state.id === v._id) && <button type="button" className="list-group-item list-group-item-action" style={{ marginLeft: `${((helper.toPath(v).match(/\//g) || []).length) * 40}px` }}>
                <form className="form-horizontal" onSubmit={this.submit}>
                  <img className="folder" src="/svg/folder.svg" alt="" />
                  &nbsp;&nbsp;
                  <input type="text" name="name" id="newFolder" placeholder="Enter your folder name" onChange={e => this.setState({ name: e.target.value })} />
                  &nbsp;&nbsp;
                  <input className="submit-create" type="submit" value="Create" />
                </form>
              </button>}
            </div>)}
        </div>
      </main>
    </aside>
  </section>
}
