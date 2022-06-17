import { Component } from 'react'
import { Progress } from 'reactstrap'
// import mime from 'mime-types'
import FolderTree from '../folder/FolderTree'
import Media from '../others/Media'
import API from '../../apis/api'
import helper from '../../services/helper'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

export default class Files extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      type: '',
      parent: '',
      location: '',
      path: '/',
      name: '',
      folder: { _id: 'root', path: '/', name: 'root' },
      folders: [],
      items: [],
      files: [],
      itemFiles: [],
      percent: 0,
      show: false,
      action: '',
      media: '',
      index: '',
    }
  }

  refresh = () => foldersService.list()
    .then(res => {
      const folders = res.data.filter(f => helper.getQuery('location') === 'trash' ? f.is_trash : !f.is_trash)
      const folder = helper.getQuery('id') === 'root'
        ? { path: '/', name: '' }
        : res.data.find(f => f._id === helper.getQuery('id'))
      const path = folder?.name === ''
        ? '/'
        : helper.toPath(folder)

      this.setState({
        folders: folders,
        items: helper.getQuery('location') === 'trash'
          ? folders
          : helper.getQuery('keyword')
            ? folders.filter(v => new RegExp(helper.getQuery('keyword'), 'ig').test(v.name))
            : folders.filter(f => f.path === path),
        path: path
      })

      filesService.list()
        .then(res => {
          const files = res.data.filter(f => helper.getQuery('location') === 'trash' ? f.is_trash : !f.is_trash)

          this.setState({
            files: files,
            itemFiles: helper.getQuery('location') === 'trash'
              ? files
              : helper.getQuery('keyword')
                ? files.filter(v => new RegExp(helper.getQuery('keyword'), 'ig').test(v.name))
                : files.filter(f => f.path === path)
          })

          if (helper.getQuery('fid')) {
            const media = this.getMedia(files.find(v => v._id === helper.getQuery('fid')))

            this.setState({ index: this.getMedias().findIndex(v => v === media) + 1, media: media })
          }
        })
    })

  return = () => helper.deleteQuery('location') || this.refresh()
    .then(() => (document.title = `My files - ${process.env.REACT_APP_NAME}`)
      && this.setState({ location: '' }))

  setTrash = () => helper.setQuery('location', 'trash') || this.refresh()
    .then(() => (document.title = `Trash - ${process.env.REACT_APP_NAME}`)
      && this.setState({ location: 'trash' }))

  isEmpty = () => helper.getQuery('location') === 'trash' && !this.state?.folders.concat(this.state?.files).filter(f => f.is_trash).length

  save = e => {
    const formData = new FormData()
    const names = []

    formData.append("path", this.state.path)
    Array.from(e.target.files).forEach(file => names.push(file.name) && formData.append("files", file, file.name))
    formData.append("names", JSON.stringify(names))

    API
      .post(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: data => this.setState({ percent: Math.round(100 * (data.loaded / data.total)) }),
      })
      .then(() => this.refresh() && this.setState({ percent: 0 }))
      .catch(err => err.response
        ? alert(typeof err.response?.data === 'object'
          ? JSON.stringify(err.response?.data)
          : err.response?.data || err.response?.statusText)
        || (err.response.status === 401 && (window.location.href = '/'))
        : console.error(err))
  }

  upload = () => document.getElementById("files").click()

  download = () => window.open(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/d/` + this.state.id)
  // API
  //   .get(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/d/` + this.state.id, {
  //     responseType: 'arraybuffer',
  //     headers: { 'Accept': mime.lookup(this.state.name) },
  //     onDownloadProgress: data => this.setState({ percent: Math.round(100 * (data.loaded / data.total)) })
  //   })
  //   .then(res => helper.downloadBlob(res.data, this.state.name) || this.setState({ percent: 0 }))
  //   .catch(err => err.response
  //     ? alert(typeof err.response?.data === 'object'
  //       ? JSON.stringify(err.response?.data)
  //       : err.response?.data || err.response?.statusText)
  //     || (err.response.status === 401 && (window.location.href = '/'))
  //     : console.error(err))

  create = () => foldersService
    .create({ name: prompt('Create folder', 'New folder'), path: this.state.path })
    .then(() => this.refresh())

  open = e => {
    if ((/folder/g).test(e.target.className) || e.target.closest('.li-folder')) {
      const folder = this.state.folders.find(f => f._id === e.target.closest('.li-folder').id)

      helper.deleteQuery('keyword')
      if (helper.getQuery('location') !== 'trash') {
        helper.setQuery('id', folder?._id)
        this.setState({ path: (this.state.path === '/' ? this.state.path : this.state.path + '/') + folder?.name })
        document.title = `${folder?.name} - ${process.env.REACT_APP_NAME}`
        this.refresh()
      }
    } else if (helper.isMedia(e.target?.closest('.li-file').getAttribute('name'))) {
      helper.setQuery('fid', e.target?.closest('.li-file').id)
      filesService
        .read(e.target?.closest('.li-file').id)
        .then((res, media = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${res.data?.path === '/' ? '/' : res.data?.path + '/'}${res.data?.name}`) =>
          this.setState({ id: e.target?.closest('.li-file').id, name: e.target?.closest('.li-file').getAttribute('name'), index: this.getMedias().findIndex(v => v === media) + 1, media: media }))
    } else if (helper.isPDF(e.target?.closest('.li-file').getAttribute('name'))) {
      filesService
        .read(e.target?.closest('.li-file').id)
        .then(res => window.open(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${res.data?.path === '/' ? '/' : res.data?.path + '/'}${res.data?.name}`))
    }
  }

  openLocation = (e, parent = this.state.folders.find(v => this.state.parent === helper.toPath(v))) =>
    window.location.href = `?id=${parent ? parent._id : 'root'}`

  close = () => (document.querySelector('body').style.overflow = 'visible')
    && (helper.deleteQuery('fid') || this.setState({ media: '' }))

  move = () => (document.body.style.overflow = 'hidden')
    && this.setState({ show: true, action: 'move' })

  copy = () => (document.body.style.overflow = 'hidden')
    && this.setState({ show: true, action: 'copy' })

  closeFolderTree = () => (document.body.style.overflow = 'visible')
    && this.setState({ show: false })

  rename = () => this.state.type === 'folder'
    ? foldersService
      .update(this.state.id, { name: prompt('Rename folder', this.state.name) })
      .then(() => this.refresh())
    : filesService
      .update(this.state.id, { name: prompt('Rename file', this.state.name) })
      .then(() => this.refresh())

  delete = () =>
    this.state.type === 'folder'
      ? helper.getQuery('location') === 'trash'
        ? foldersService
          .deleteForever(this.state.id)
          .then(() => this.refresh())
        : foldersService
          .delete(this.state.id)
          .then(() => this.refresh())
      : helper.getQuery('location') === 'trash'
        ? filesService
          .deleteForever(this.state.id)
          .then(() => this.refresh())
        : filesService
          .delete(this.state.id)
          .then(() => this.refresh())

  restore = () => this.state.type === 'folder'
    ? foldersService
      .restore(this.state.id)
      .then(() => this.refresh())
    : filesService
      .restore(this.state.id)
      .then(() => this.refresh())

  restoreTrash = () => window.confirm('Restore all?\nAre you sure you want to restore all the items?')
    && this.state.folders?.filter(f => f.is_trash)
      .map(f => foldersService
        .restore(f._id)
        .then(() => this.refresh()))
    && this.state.files?.filter(f => f.is_trash)
      .map(f => filesService
        .restore(f._id)
        .then(() => this.refresh()))

  empty = () => window.confirm('Empty all?\nAre you sure you want to permanently delete all of these items?')
    && this.state.folders?.filter(f => f.is_trash)
      .map(f => foldersService
        .deleteForever(f._id)
        .then(() => this.refresh()))
    && this.state.files?.filter(f => f.is_trash)
      .map(f => filesService
        .deleteForever(f._id)
        .then(() => this.refresh()))

  choose = e => {
    e.preventDefault()

    const type = (/file|img|video/g).test(e.target.className)
      ? e.target.closest('.li-folder')
        ? 'folder'
        : 'file'
      : (/folder/g).test(e.target.className)
        ? 'folder'
        : null

    this.getMenuFolder().style.display = 'block'
    this.getMenuFolder().style.top = `${e.clientY}px`
    this.getMenuFolder().style.left = `${e.clientX}px`
    this.setState({
      id: e.target.closest(`.li-${type}`)?.id,
      type: type,
      name: e.target.closest(`.li-${type}`)?.getAttribute('name'),
      parent: e.target.closest(`.li-${type}`)?.getAttribute('value')
    })

    document.querySelector('.dropdown-item-download').style.setProperty('display', type === 'folder' ? 'none' : 'flex', 'important')
  }

  clickOut = e => this.getMenuFolder().style.display = 'none'

  getMenuFolder = () => document.querySelector('.dropdown-menu-folder')

  access = e => {
    const index = Number.parseInt(e.target.id)
    const path = index === 1 ? '/' : this.state.path.split('/').slice(0, index).join('/')
    const folder = this.state.folders.find(f => f.path === path && f.name === this.state.path.split('/')[index])

    this.setState({ path: path ? path : '/' })
    helper.setQuery('id', Number.parseInt(e.target.id) === 0 ? 'root' : folder?._id)
    this.refresh()
  }

  getMediaFiles = () => this.state.files.filter(v => v.path === this.state.path && helper.isMedia(v.name))

  getMedia = v => `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${v.path === '/' ? '/' : v.path + '/'}${v.name}`

  getMedias = () => this.getMediaFiles().map(v => this.getMedia(v))

  prev = (e, medias = this.getMedias(), files = this.getMediaFiles()) =>
    medias.findIndex(v => v === this.state.media) > 0
    && (helper.setQuery('fid', files[this.state.index - 2]._id)
      || (this.setState({ index: this.state.index - 1, media: medias[medias.findIndex(v => v === this.state.media) - 1] })))

  next = (e, medias = this.getMedias(), files = this.getMediaFiles()) =>
    medias.findIndex(v => v === this.state.media) < medias.length - 1
    && (helper.setQuery('fid', files[this.state.index]._id)
      || this.setState({ index: this.state.index + 1, media: medias[medias.findIndex(v => v === this.state.media) + 1] }))

  componentDidMount = () => this.refresh()
    .then(() => (document.title = `${helper.getQuery('location') === 'trash'
      ? 'Trash'
      : helper.getQuery('id') === 'root'
        ? 'My files'
        : this.state.folders.find(v => v._id === helper.getQuery('id')).name}
         - ${process.env.REACT_APP_NAME}`)
      && !window.location.search && (window.location.search = 'id=root'))

  render = () => <section className="section-files" onClick={this.clickOut} >
    <ul className="dropdown-menu-folder">
      {!helper.getQuery('location') && <li className="dropdown-item-move" onClick={this.move}><i className="material-icons">drive_file_move</i>Move to...</li>}
      {!helper.getQuery('location') && <li className="dropdown-item-copy" onClick={this.copy}><i className="material-icons">{this.state.type === 'folder' ? 'folder_copy' : 'file_copy'}</i>Copy to...</li>}
      {!helper.getQuery('location') && <li><hr className="dropdown-divider" /></li>}
      <li className="dropdown-item-download" onClick={this.download}><i className="material-icons">file_download</i>Download</li>
      <li className="dropdown-item-rename" onClick={this.rename}><i className="material-icons">drive_file_rename_outline</i>Rename</li>
      {helper.getQuery('location') === 'trash' && <li className="dropdown-item-restore" onClick={this.restore}><i className="material-icons">restore</i>Restore</li>}
      <li className="dropdown-item-delete" onClick={this.delete}><i className="material-icons">{helper.getQuery('location') === 'trash' ? 'delete_forever' : 'delete'}</i>Delete {helper.getQuery('location') === 'trash' && 'forever'}</li>
      {helper.getQuery('keyword') && <li><hr className="dropdown-divider" /></li>}
      {helper.getQuery('keyword') && <li className="dropdown-item-location" onClick={this.openLocation}><i className="material-icons">location_on</i>Open item location</li>}
    </ul>
    <nav className="left-nav col-2" id="leftNav">
      <div className="top-left-nav">
        <label htmlFor="leftNav"><strong>{helper.getCookie('first_name') + ' ' + helper.getCookie('last_name')}</strong></label>
      </div>
      <ul className="list-group">
        <li className={`list-group-item-files ${!helper.getQuery('location') && 'active'}`} onClick={this.return}><i className="material-icons">folder</i> My files</li>
        <li className={`list-group-item-trash ${helper.getQuery('location') === 'trash' && 'active'} `} onClick={this.setTrash}><i className="material-icons">delete</i> Trash</li>
      </ul>
    </nav>
    <main className="main-content">
      {helper.getQuery('location') === 'trash'
        ? !this.isEmpty() && <span className="main-command-bar">
          <button className="btn-restore" onClick={this.restoreTrash}><i className="material-icons">restore_from_trash</i> Restore</button>
          <button className="btn-empty" onClick={this.empty}><i className="material-icons">delete_forever</i> Empty</button>
        </span>
        : <span className="main-command-bar">
          <button className="btn-new-folder" onClick={this.create}><i className="material-icons">create_new_folder</i> New</button>
          <input type="file" id="files" onChange={this.save} multiple hidden />
          <button className="btn-update" onClick={this.upload}><i className="material-icons">publish</i> Upload</button>
        </span>}
      {!!this.state.percent && <Progress value={this.state.percent} />}
      {helper.getQuery('location') === 'trash'
        ? !this.isEmpty() && <div className="space-bar"></div>
        : helper.getQuery('id')
          ? <span className="path-bar">
            {this.state.path === '/' ? <strong>My files</strong> : this.state.path.split('/').map((v, i, a) => <div key={i}>{i === 0 ? <div className="dir"><p className="dir-parent" id={i} onClick={this.access}>My files</p><p>&nbsp;&gt;&nbsp;</p></div> : i === a.length - 1 ? <p><strong>{v}</strong></p> : <div className="dir"><p className="dir-parent" id={i} onClick={this.access}>{v}</p><p>&nbsp;&gt;&nbsp;</p></div>}</div>)}
          </span>
          : helper.getQuery('keyword') && <h5 className="title-bar"><strong>{`Search results for "${helper.getQuery('keyword')}"`}</strong></h5>}
      {!this.isEmpty() && <ul className="ls-folder">
        {this.state.items.map((v, i, a) => a.length ? <li className="li-folder" key={i} id={v._id} name={v.name} title={v.name} value={v.path} onClick={this.open} onContextMenu={this.choose}>
          <img className="bg-folder" id={`folder${i}`} src="svg/lg-bg.svg" alt="background folder" />
          {helper.isImages(this.state.files, v)
            ? <img className="img" src={`${process.env.NODE_ENV === 'production'
              ? window.location.origin + '/api'
              : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${helper.getImage(this.state.files, v).path === '/'
                ? '/' : helper.getImage(this.state.files, v).path + '/'}${helper.getImage(this.state.files, v).name}`} alt="foreground folder" />
            : helper.isVideos(this.state.files, v)
              ? <video className="video-preview" src={`${process.env.NODE_ENV === 'production'
                ? window.location.origin + '/api'
                : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${helper.getVideo(this.state.files, v).path === '/'
                  ? '/'
                  : helper.getVideo(this.state.files, v).path + '/'}${helper.getVideo(this.state.files, v).name}`} ></video >
              : !helper.isEmpty(this.state.folders, this.state.files, v)
              && <div className="file"></div>}
          {helper.isImages(this.state.files, v) || helper.isVideos(this.state.files, v) ? <img className="fg-folder" src="svg/lg-fg-media.svg" alt="foreground folder" onContextMenu={this.choose} /> : <img className="fg-folder" src="svg/lg-fg.svg" alt="foreground folder" />}
          <label className="label-folder" htmlFor={`folder${i}`}>{v.name}</label>
        </li > : <li>This folder is empty</li>)}
        {
          this.state.itemFiles.map((v, i) => <li className="li-file" key={i} id={v._id} name={v.name} value={v.path} title={v.name} onClick={this.open} onContextMenu={this.choose}>
            {helper.isImage(v.name) ? <img className="bg-img" id={`file${i}`} src={this.getMedia(v)} alt={`Img ${i}`} /> : helper.isVideo(v.name) ? <video className="bg-video" src={this.getMedia(v)}></video> : <i className="material-icons bg-file">{helper.isAudio(v.name) ? 'audio_file' : 'description'}</i>}
            <label className="label-file" htmlFor={`file${i}`} style={{ marginTop: helper.isVideo(v.name) ? '-8px' : '85px' }} >{v.name}</label>
          </li>)
        }
      </ul >}
      {this.isEmpty() && <div className="empty-trash"><i className="material-icons">delete_outline</i><strong>Trash is Empty</strong></div>}
    </main >
    {this.state.media && <Media src={this.state.media} type={helper.isImage(this.state.media) ? 'image' : helper.isVideo(this.state.media) ? 'video' : helper.isAudio(this.state.media) ? 'audio' : 'none'} download={this.download} percent={this.state.percent} next={this.next} prev={this.prev} index={this.state.index} count={this.getMedias().length} close={this.close} />}
    {this.state.show && <FolderTree id={this.state.id} name={this.state.name} type={this.state.type} parent={this.state.parent} action={this.state.action} refresh={this.refresh} folders={this.state.folders} close={this.closeFolderTree} />}
  </section >
}