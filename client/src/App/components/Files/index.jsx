import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Progress } from 'reactstrap'
import {
  list,
  openFile,
  readFile,
  selectFiles,
  selectFolders,
  selectIndex,
  selectItemFiles,
  selectItems,
  selectMedia,
  selectMediaFiles,
  selectMedias,
  selectPath,
  setPath
} from './slice'
import {
  setWidth,
} from '../Header/slice'
import Media from '../Media'
import FolderTree from '../FolderTree'
import helper from '../../services/helper'

export default function Files() {
  const dispatch = useDispatch()

  const folders = useSelector(selectFolders)
  const files = useSelector(selectFiles)
  const items = useSelector(selectItems)
  const itemFiles = useSelector(selectItemFiles)
  const path = useSelector(selectPath)
  const mediaFiles = useSelector(selectMediaFiles)
  const medias = useSelector(selectMedias)
  const media = useSelector(selectMedia)
  const index = useSelector(selectIndex)

  const [id, setID] = useState('')
  const [type, setType] = useState('')
  const [percent, setPercent] = useState(0)
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [parent, setParent] = useState('')
  const [action, setAction] = useState('')

  useEffect(() => {
    window.onresize = () => {
      setMainContent()
      dispatch(setWidth())
    }
    document.title = `My files - ${process.env.REACT_APP_NAME}`
    setMainContent()
    refresh()
  }, [])

  const refresh = () => dispatch(list())

  const getMenuFolder = () => document.querySelector('.dropdown-menu-folder')

  const setMainContent = () => document.querySelector('.main-content').style.marginLeft = document.querySelector('.left-nav').clientWidth + 'px'

  const clickOut = () => getMenuFolder().style.display = 'none'

  const create = () => { }

  const move = () => { }

  const copy = () => { }

  const download = () => { }

  const rename = () => { }

  const restore = () => { }

  const _delete = () => { }

  const openLocation = () => { }

  const back = () => { }

  const setTrash = () => { }

  const isEmpty = () => false

  const restoreTrash = () => { }

  const empty = () => { }

  const upload = () => { }

  const save = () => { }

  const access = () => { }

  const open = e => {
    if ((/folder/g).test(e.target.className) || e.target.closest('.li-folder')) {
      const folder = folders.find(f => f._id === e.target.closest('.li-folder').id)

      helper.deleteQuery('keyword')
      if (helper.getQuery('location') !== 'trash') {
        helper.setQuery('id', folder?._id)
        document.title = `${folder?.name} - ${process.env.REACT_APP_NAME}`
        setPath(path + folder?.name)
        refresh()
      }
    } else if (helper.isMedia(e.target?.closest('.li-file').getAttribute('name'))) {
      helper.setQuery('fid', e.target?.closest('.li-file').id)
      dispatch(readFile(e.target?.closest('.li-file').id))
      setID(e.target?.closest('.li-file').id)
      setName(e.target?.closest('.li-file').getAttribute('name'))
    } else if (helper.isPDF(e.target?.closest('.li-file').getAttribute('name')))
      dispatch(readFile(e.target?.closest('.li-file').id))
        .then(action => dispatch(openFile(helper.getMedia(action.payload))))
  }

  const choose = () => { }

  const next = () => { }

  const prev = () => { }

  const close = () => { }

  const closeFolderTree = () => { }

  return <section className="section-files" onClick={clickOut}>
    <ul className="dropdown-menu-folder">
      {!helper.getQuery('location') && <li className="dropdown-item-move" onClick={move}><i className="material-icons">drive_file_move</i>Move to...</li>}
      {!helper.getQuery('location') && <li className="dropdown-item-copy" onClick={copy}><i className="material-icons">{type === 'folder' ? 'folder_copy' : 'file_copy'}</i>Copy to...</li>}
      {!helper.getQuery('location') && <li><hr className="dropdown-divider" /></li>}
      <li className="dropdown-item-download" onClick={download}><i className="material-icons">file_download</i>Download</li>
      <li className="dropdown-item-rename" onClick={rename}><i className="material-icons">drive_file_rename_outline</i>Rename</li>
      {helper.getQuery('location') === 'trash' && <li className="dropdown-item-restore" onClick={restore}><i className="material-icons">restore</i>Restore</li>}
      <li className="dropdown-item-delete" onClick={_delete}><i className="material-icons">{helper.getQuery('location') === 'trash' ? 'delete_forever' : 'delete'}</i>Delete {helper.getQuery('location') === 'trash' && 'forever'}</li>
      {helper.getQuery('keyword') && <li><hr className="dropdown-divider" /></li>}
      {helper.getQuery('keyword') && <li className="dropdown-item-location" onClick={openLocation}><i className="material-icons">location_on</i>Open item location</li>}
    </ul>
    <nav className="left-nav col-2" id="leftNav">
      <div className="top-left-nav">
        <label htmlFor="leftNav"><strong>{helper.getCookie('first_name') + ' ' + helper.getCookie('last_name')}</strong></label>
      </div>
      <ul className="list-group">
        <li className={`list-group-item-files ${!helper.getQuery('location') && 'active'}`} onClick={back}><i className="material-icons">folder</i> My files</li>
        <li className={`list-group-item-trash ${helper.getQuery('location') === 'trash' && 'active'} `} onClick={setTrash}><i className="material-icons">delete</i> Trash</li>
      </ul>
    </nav>
    {/* {console.log('T')} */}
    <main className="main-content">
      {helper.getQuery('location') === 'trash'
        ? !isEmpty() && <span className="main-command-bar">
          <button className="btn-restore" onClick={restoreTrash}><i className="material-icons">restore_from_trash</i> Restore</button>
          <button className="btn-empty" onClick={empty}><i className="material-icons">delete_forever</i> Empty</button>
        </span>
        : <span className="main-command-bar">
          <button className="btn-new-folder" onClick={create}><i className="material-icons">create_new_folder</i> New</button>
          <input type="file" id="files" onChange={save} multiple hidden />
          <button className="btn-update" onClick={upload}><i className="material-icons">publish</i> Upload</button>
        </span>}
      {!!percent && <Progress value={percent} />}
      {helper.getQuery('location') === 'trash'
        ? !isEmpty() && <div className="space-bar"></div>
        : helper.getQuery('id')
          ? <span className="path-bar">
            {path === '/' ? <strong>My files</strong> : path.replace(/\/$/, '').split('/').map((v, i, a) => <div key={i}>{i === 0 ? <div className="dir"><p className="dir-parent" id={i} onClick={access}>My files</p><p>&nbsp;&gt;&nbsp;</p></div> : i === a.length - 1 ? <p><strong>{v}</strong></p> : <div className="dir"><p className="dir-parent" id={i} onClick={access}>{v}</p><p>&nbsp;&gt;&nbsp;</p></div>}</div>)}
          </span>
          : helper.getQuery('keyword') && <h5 className="title-bar"><strong>{`Search results for "${helper.getQuery('keyword')}"`}</strong></h5>}
      {!isEmpty() && <ul className="ls-folder">
        {items.map((v, i, a) => a.length ? <li className="li-folder" key={i} id={v._id} name={v.name} title={v.name} value={v.path} onClick={open} onContextMenu={choose}>
          <img className="bg-folder" id={`folder${i}`} src="svg/lg-bg.svg" alt="background folder" />
          {helper.isImages(files, v)
            ? <img className="img" src={`${process.env.NODE_ENV === 'production'
              ? window.location.origin + '/api'
              : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${helper.getImage(files, v).path === '/'
                ? '/'
                : helper.getImage(files, v).path}${helper.getImage(files, v).name}`} alt="foreground folder" />
            : helper.isVideos(files, v)
              ? <video className="video-preview" src={`${process.env.NODE_ENV === 'production'
                ? window.location.origin + '/api'
                : process.env.REACT_APP_API}/media/?path=${helper.getCookie('id')}/files${helper.getVideo(files, v).path === '/'
                  ? '/'
                  : helper.getVideo(files, v).path}${helper.getVideo(files, v).name}`}></video>
              : !helper.isEmpty(folders, files, v)
              && <div className="file"></div>}
          {helper.isImages(files, v) || helper.isVideos(files, v) ? <img className="fg-folder" src="svg/lg-fg-media.svg" alt="foreground folder" onContextMenu={choose} /> : <img className="fg-folder" src="svg/lg-fg.svg" alt="foreground folder" />}
          <label className="label-folder" htmlFor={`folder${i}`}>{v.name}</label>
        </li> : <li>This folder is empty</li>)}
        {
          itemFiles.map((v, i) => <li className="li-file" key={i} id={v._id} name={v.name} value={v.path} title={v.name} onClick={open} onContextMenu={choose}>
            {helper.isImage(v.name) ? <img className="bg-img" id={`file${i}`} src={helper.getMedia(v)} alt={`Img ${i}`} /> : helper.isVideo(v.name) ? <video className="bg-video" src={helper.getMedia(v)}></video> : <i className="material-icons bg-file">{helper.isAudio(v.name) ? 'audio_file' : 'description'}</i>}
            <label className="label-file" htmlFor={`file${i}`} style={{ marginTop: helper.isVideo(v.name) ? '-8px' : '85px' }}>{v.name}</label>
          </li>)
        }
      </ul>}
      {isEmpty() && <div className="empty-trash"><i className="material-icons">delete_outline</i><strong>Trash is Empty</strong></div>}
    </main>
    {media && <Media src={media} type={helper.isImage(media) ? 'image' : helper.isVideo(media) ? 'video' : helper.isAudio(media) ? 'audio' : 'none'} download={download} percent={percent} next={next} prev={prev} index={index} count={medias?.length} close={close} />}
    {show && <FolderTree id={id} name={name} type={type} parent={parent} action={action} refresh={refresh} folders={folders} close={closeFolderTree} />}
  </section>
}
