import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import Progress from '../Progress'
import {
  createFolder,
  list,
  openFile,
  readFile,
  selectFiles,
  selectFolders,
  selectIndex,
  selectItemFiles,
  selectItemFolders,
  selectItemPrev,
  selectItems,
  selectMedia,
  selectMediaFiles,
  selectMedias,
  selectPath,
  setItemPrev,
  setItems,
  setPath,
} from './slice'
import {
  setWidth,
} from '../Header/slice'
import {
  setValue,
  selectShowProgress,
  showProgressComponent,
  setUploadFiles,
  startUpload,
  finishUpload,
  selectUploading,
  setSuccess,
} from '../Progress/slice'
import formDataAPI from '../../apis/form-data'
import Media from '../Media'
import FolderTree from '../FolderTree'
import helper from '../../services/helper'

export default function Files() {
  const dispatch = useDispatch()

  const folders = useSelector(selectFolders)
  const files = useSelector(selectFiles)
  const items = useSelector(selectItems)
  const itemFolders = useSelector(selectItemFolders)
  const itemFiles = useSelector(selectItemFiles)
  const itemPrev = useSelector(selectItemPrev)
  const path = useSelector(selectPath)
  const mediaFiles = useSelector(selectMediaFiles)
  const medias = useSelector(selectMedias)
  const media = useSelector(selectMedia)
  const index = useSelector(selectIndex)
  const showProgress = useSelector(selectShowProgress)
  const uploading = useSelector(selectUploading)

  const controllers = useRef(null)

  const [showFolderTree, setShowFolderTree] = useState(false)
  const [action, setAction] = useState('')

  useEffect(() => {
    window.onresize = () => {
      setMainContent()
      setMainCommandBar()
      dispatch(setWidth())
    }
    document.title = `My files - ${process.env.REACT_APP_NAME}`
    setMainContent()
    setMainCommandBar()
    refresh()
  }, [])

  const refresh = () => dispatch(list())

  const getMenuFolder = () => document.querySelector('.dropdown-menu-folder')

  const setMainContent = () => document.querySelector('.main-content').style.marginLeft = document.querySelector('.left-nav').clientWidth + 'px'

  const setMainCommandBar = () => document.querySelector('.main-command-bar').style.width = (window.innerWidth - document.querySelector('.left-nav').clientWidth) + 'px'

  const clickOut = () => getMenuFolder().style.display = 'none'

  const createNewFolder = () => dispatch(createFolder({ name: prompt('Create folder', 'New folder'), path: path }))
    .then(action => action.type === 'files/createFolder/fulfilled' && refresh())

  const upload = () => document.getElementById("files").click()

  const save = async e => {
    const files = Array.from(e.target.files).map(v => ({ name: v.name, value: 0, show: true, cancel: false, success: false, done: false }))
    controllers.current = '0'.repeat(files.length).split('').map(() => new AbortController())

    await dispatch(setUploadFiles(files))
    await dispatch(showProgressComponent())

    controllers.current.length
      && dispatch(startUpload())
      && Array.from(e.target.files)
        .forEach((v, i, a) => {
          const formData = new FormData()

          formData.append("path", path)
          formData.append("files", v, v.name)
          formData.append("names", JSON.stringify([v.name]))

          formDataAPI.post(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/`, formData, {
            signal: controllers.current[i].signal,
            onUploadProgress: data => dispatch(setValue({ index: i, value: Math.round(100 * (data.loaded / data.total)) })),
          })
            .then(() => dispatch(setSuccess(i)))
            .finally(async () => (await dispatch(finishUpload(i))) && refresh())
        })
  }

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

  const open = e => {
    clear()

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
    } else if (helper.isPDF(e.target?.closest('.li-file').getAttribute('name')))
      dispatch(readFile(e.target?.closest('.li-file').id))
        .then(action => dispatch(openFile(helper.getMedia(action.payload))))
  }

  const access = e => {
    const index = parseInt(e.target.id)
    const newpath = index === 1 ? '/' : path.replace(/\/$/, '').split('/').slice(0, index).join('/')
    const folder = folders.find(f => f.path.replace(/\/$/, '') === newpath.replace(/\/$/, '') && f.name === path.split('/')[index])

    document.title = `${index === 0 ? 'My files' : folder?.name} - ${process.env.REACT_APP_NAME}`
    setPath(newpath ? newpath : '/')
    helper.setQuery('id', parseInt(e.target.id) === 0 ? 'root' : folder?._id)
    refresh()
  }

  const clear = () => {
    document.querySelectorAll('.li-folder')
      .forEach(v => v.classList.contains('bg-info') && v.classList.remove('bg-info'))
    document.querySelectorAll('.li-file')
      .forEach(v => v.classList.contains('bg-info') && v.classList.remove('bg-info'))

    dispatch(setItems([]))
    dispatch(setItemPrev(null))
  }

  const select = index => e => {
    const target = (e.target.closest('.li-folder') || e.target.closest('.li-file'))
    const item = {
      index,
      id: target.id,
      type: /li-folder/.test(target.className)
        ? 'folder'
        : /li-file/.test(target.className)
          ? 'file'
          : null,
      name: target?.getAttribute('name'),
      parent: target?.getAttribute('value'),
    }

    if (e.ctrlKey) {
      const arr = [...items]

      target.classList.contains('bg-info')
        ? target.classList.remove('bg-info')
        || (arr.splice(arr.findIndex(v => v.id === item.id && v.type === item.type), 1)
          && dispatch(setItemPrev(arr?.length ? arr[arr?.length - 1] : null)))
        : target.classList.add('bg-info')
        || (arr.push(item)
          && dispatch(setItemPrev(item)))

      dispatch(setItems(arr))
    } else if (e.shiftKey) {
      if (itemPrev) {
        if (itemPrev.type === item.type) {
          const arr = []

          clear()
          for (let i = itemPrev.index; itemPrev.index < item.index ? i <= item.index : i >= item.index; itemPrev.index < item.index ? i++ : i--) {
            document.querySelectorAll(`.li-${item.type}`)[i].classList.add('bg-info')
            arr.push({
              index: i,
              id: document.querySelectorAll(`.li-${item.type}`)[i].id,
              type: item.type,
              name: document.querySelectorAll(`.li-${item.type}`)[i]?.getAttribute('name'),
              parent: document.querySelectorAll(`.li-${item.type}`)[i]?.getAttribute('value'),
            })
          }

          dispatch(setItems(arr))
          dispatch(setItemPrev(item))
        } else {
          const arr = []

          clear()
          for (let i = (itemPrev.type === 'folder' ? itemPrev : item).index; i < document.querySelectorAll('.li-folder').length; i++) {
            document.querySelectorAll('.li-folder')[i].classList.add('bg-info')
            arr.push({
              index: i,
              id: document.querySelectorAll('.li-folder')[i].id,
              type: 'folder',
              name: document.querySelectorAll('.li-folder')[i]?.getAttribute('name'),
              parent: document.querySelectorAll('.li-folder')[i]?.getAttribute('value'),
            })
          }
          for (let i = 0; i <= (itemPrev.type === 'file' ? itemPrev : item).index; i++) {
            document.querySelectorAll('.li-file')[i].classList.add('bg-info')
            arr.push({
              index: i,
              id: document.querySelectorAll('.li-file')[i].id,
              type: 'file',
              name: document.querySelectorAll('.li-file')[i]?.getAttribute('name'),
              parent: document.querySelectorAll('.li-file')[i]?.getAttribute('value'),
            })
          }

          dispatch(setItems(arr))
          dispatch(setItemPrev(item))
        }
      } else {
        target.classList.add('bg-info')

        dispatch(setItems([item]))
        dispatch(setItemPrev(item))
      }
    } else {
      clear()
      target.classList.add('bg-info')

      dispatch(setItems([item]))
      dispatch(setItemPrev(item))
    }
  }

  const choose = index => e => {
    const target = (e.target.closest('.li-folder') || e.target.closest('.li-file'))
    const item = {
      index,
      id: target.id,
      type: /li-folder/.test(target.className)
        ? 'folder'
        : /li-file/.test(target.className)
          ? 'file'
          : null,
      name: target?.getAttribute('name'),
      parent: target?.getAttribute('value'),
    }

    !e.ctrlKey && e.preventDefault()

    getMenuFolder().style.display = 'block'
    getMenuFolder().style.top = `${e.clientY}px`
    getMenuFolder().style.left = `${e.clientX}px`
    document.querySelector('.dropdown-item-download')
      .style.setProperty(
        'display',
        item.type === 'folder'
          ? 'none'
          : 'flex',
        'important')

    if (!items.some(v => v.type === item.type && v.id === item.id)) {
      clear()

      target.classList.add('bg-info')

      dispatch(setItems([item]))
      dispatch(setItemPrev(item))
    }
  }

  const next = () => { }

  const prev = () => { }

  const close = () => { }

  const closeFolderTree = () => { }

  return <section className="section-files" onClick={clickOut}>
    <ul className="dropdown-menu-folder">
      {!helper.getQuery('location') && <li className="dropdown-item-move" onClick={move}><i className="material-icons">drive_file_move</i>Move to...</li>}
      {!helper.getQuery('location') && <li className="dropdown-item-copy" onClick={copy}><i className="material-icons">{`${items.every(v => v.type === 'file') ? 'file' : 'folder'}_copy`}</i>Copy to...</li>}
      {!helper.getQuery('location') && <li><hr className="dropdown-divider" /></li>}
      <li className="dropdown-item-download" onClick={download}><i className="material-icons">file_download</i>Download</li>
      <li className="dropdown-item-rename" onClick={rename}><i className="material-icons">drive_file_rename_outline</i>Rename</li>
      {helper.getQuery('location') === 'trash' && <li className="dropdown-item-restore" onClick={restore}><i className="material-icons">restore</i>Restore</li>}
      <li className="dropdown-item-delete" onClick={_delete}><i className="material-icons">{helper.getQuery('location') === 'trash' ? 'delete_forever' : 'delete'}</i>Delete {helper.getQuery('location') === 'trash' && 'forever'}</li>
      {helper.getQuery('keyword') && <li><hr className="dropdown-divider" /></li>}
      {helper.getQuery('keyword') && <li className="dropdown-item-location" onClick={openLocation}><i className="material-icons">location_on</i>Open item location</li>}
    </ul>
    <nav className="left-nav col-2" id="leftNav" onClick={clear}>
      <div className="top-left-nav">
        <label htmlFor="leftNav"><strong>{helper.getCookie('first_name') + ' ' + helper.getCookie('last_name')}</strong></label>
      </div>
      <ul className="list-group">
        <li className={`list-group-item-files ${!helper.getQuery('location') && 'active'}`} onClick={back}><i className="material-icons">folder</i> My files</li>
        <li className={`list-group-item-trash ${helper.getQuery('location') === 'trash' && 'active'} `} onClick={setTrash}><i className="material-icons">delete</i> Trash</li>
      </ul>
    </nav>
    <main className="main-content">
      {helper.getQuery('location') === 'trash'
        ? !isEmpty() && <span className="main-command-bar" onClick={clear}>
          <button className="btn-restore" onClick={restoreTrash}><i className="material-icons">restore_from_trash</i> Restore</button>
          <button className="btn-empty" onClick={empty}><i className="material-icons">delete_forever</i> Empty</button>
        </span>
        : <span className="main-command-bar" onClick={clear}>
          <span className="primary-command">
            <UncontrolledDropdown className="dropdown-new">
              <DropdownToggle className="dropdown-toggle-new" caret>
                <i className="material-icons">add</i>New
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className="dropdown-item-normal" onClick={createNewFolder}>
                  <img src="/svg/folder.svg" alt="Folder" />
                  Folder
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem><img src="/svg/txt.svg" alt="Plain text document" /> Plain text document</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <input type="file" id="files" onChange={save} multiple hidden />
            <button className="btn-upload" onClick={upload}><i className="material-icons">publish</i> Upload</button>
          </span>
          <span className="middle-command">
          </span>
          <span className="secondary-command">
            {uploading && <button className="btn-show-progress" type="button" onClick={() => dispatch(showProgressComponent())}><i className="material-icons">backup</i>Uploading...</button>}
          </span>
        </span>}
      {helper.getQuery('location') === 'trash'
        ? !isEmpty() && <div className="space-bar"></div>
        : helper.getQuery('id')
          ? <span className="path-bar" onClick={clear}>
            {path === '/' ? <strong>My files</strong> : path.replace(/\/$/, '').split('/').map((v, i, a) => <div key={i}>{i === 0 ? <div className="dir"><p className="dir-parent" id={i} onClick={access}>My files</p><p>&nbsp;&gt;&nbsp;</p></div> : i === a.length - 1 ? <p><strong>{v}</strong></p> : <div className="dir"><p className="dir-parent" id={i} onClick={access}>{v}</p><p>&nbsp;&gt;&nbsp;</p></div>}</div>)}
          </span>
          : helper.getQuery('keyword') && <h5 className="title-bar"><strong>{`Search results for "${helper.getQuery('keyword')}"`}</strong></h5>}
      {!isEmpty() && <ul className="ls-items">
        {itemFolders.map((v, i, a) => a.length ? <li className="li-folder" key={i} id={v._id} name={v.name} title={v.name} value={v.path} onClick={select(i)} onDoubleClick={open} onContextMenu={choose(i)}>
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
          {helper.isImages(files, v) || helper.isVideos(files, v) ? <img className="fg-folder" src="svg/lg-fg-media.svg" alt="foreground folder" onContextMenu={choose(i)} /> : <img className="fg-folder" src="svg/lg-fg.svg" alt="foreground folder" />}
          <label className="label-folder" htmlFor={`folder${i}`}>{v.name}</label>
        </li> : <li>This folder is empty</li>)}
        {itemFiles.map((v, i) => <li className="li-file" key={i} id={v._id} name={v.name} value={v.path} title={v.name} onClick={select(i)} onDoubleClick={open} onContextMenu={choose(i)}>
          {helper.isImage(v.name)
            ? <img className="bg-img" id={`file${i}`} src={helper.getMedia(v)} alt={`Img ${i}`} />
            : helper.isVideo(v.name)
              ? <video className="bg-video" src={helper.getMedia(v)}></video>
              : <i className="material-icons bg-file">{helper.isAudio(v.name) ? 'audio_file' : 'description'}</i>
          }
          <label className="label-file" htmlFor={`file${i}`} style={{ marginTop: helper.isVideo(v.name) ? '-8px' : '85px' }}>{v.name}</label>
        </li>)}
      </ul>}
      {isEmpty() && <div className="empty-trash"><i className="material-icons">delete_outline</i><strong>Trash is Empty</strong></div>}
    </main>
    {media && <Media src={media} type={helper.isImage(media) ? 'image' : helper.isVideo(media) ? 'video' : helper.isAudio(media) ? 'audio' : 'none'} download={download} next={next} prev={prev} index={index} count={medias?.length} close={close} />}
    {showFolderTree && <FolderTree item={items?.[0]} action={action} refresh={refresh} folders={folders} close={closeFolderTree} />}
    {showProgress && <Progress controllers={controllers} />}
  </section>
}