import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import FolderCopyIcon from '@mui/icons-material/FolderCopy'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {
  selectFolders,
  selectId,
  selectNew,
  selectShowedFolders,
  setName,
  setNew,
  setShowedFolders,
  setFolders,
  selectName,
  setId
} from './slice'
import foldersService from '../../services/folders'
import filesService from '../../services/files'
import helper from '../../services/helper'
import { selectAction, selectItems, selectType } from '../Files/slice'
import { close as closeFolderTree } from './slice'

export default function FolderTree(props) {
  const dispatch = useDispatch()

  const action = useSelector(selectAction)
  const _new = useSelector(selectNew)
  const showedFolders = useSelector(selectShowedFolders)
  const id = useSelector(selectId)
  const folders = useSelector(selectFolders)
  const items = useSelector(selectItems)
  const name = useSelector(selectName)
  const type = useSelector(selectType)

  const refresh = () => new Promise(async resolve => {
    const res = await foldersService.list()
    await props.refresh()
    const folders = res.data?.map(v => (v._id = `T${v._id}`) && v)

    dispatch(setFolders(folders))
    resolve(folders)
  })

  useEffect(() => {
    refresh()
      .then(() => dispatch(setShowedFolders(folders.filter(v => v.path === '/'))))
  }, [])

  const create = async () => {
    await new Promise(resolve => {
      dispatch(setNew(true))
      resolve()
    })

    document.querySelector('#newFolder').focus()
  }

  const select = e => {
    document.querySelectorAll('.list-group-item')
      .forEach(v => v?.classList.contains('active')
        && v?.classList.remove('active'))

    e.target.closest('button')?.classList.add('active')

    e.target.closest('button')?.classList.contains('open')
      ? close(e.target.closest('button').id)
      : open(e.target.closest('button').id)

    dispatch(setNew(false))
    dispatch(setId(e.target.closest('button').id))
  }

  const open = id => {
    const target = document.querySelector(`#${id}`)

    if (id === 'TRoot') {
      dispatch(setShowedFolders(folders.filter(v => v.path === '/')))

      if (!target.classList.contains('open')) {
        target.classList.add('open')
      }
    }
    else {
      const subfolders = folders.filter(f => f.path === helper.toPath(folders.find(v => v._id === id)))

      if (!showedFolders.some(v => subfolders.includes(v))) dispatch(setShowedFolders(showedFolders.concat(subfolders)))

      subfolders.length
        && !target.classList.contains('open')
        && target.classList.add('open')
    }
  }

  const close = id => {
    const target = document.querySelector(`#${id}`)

    if (id === 'TRoot') {
      dispatch(setShowedFolders([]))

      target.classList.contains('open')
        && target.classList.remove('open')
    }
    else {
      const subfolders = folders.filter(f => f.path === helper.toPath(folders.find(v => v._id === id)))

      showedFolders.some(v => subfolders.includes(v))
        && dispatch(setShowedFolders(showedFolders.filter(v => !subfolders.some(s => new RegExp(s.path).test(v.path)))))

      subfolders.map(v => document.getElementById(v._id)?.classList.contains('open')
        && document.getElementById(v._id)?.classList.remove('open'))

      subfolders.length
        && target.classList.contains('open')
        && target.classList.remove('open')
    }
  }

  const toggle = () => { }

  const move = () => items.map(v => v.type === 'folder'
    ? foldersService.move(v.id, id.slice(1))
      .then(res => refresh()
        .then(() => dispatch(closeFolderTree()) || alert(res.data)))
    : filesService.move(v.id, id.slice(1))
      .then(res => refresh()
        .then(() => dispatch(closeFolderTree()) || alert(res.data))))

  const copy = () => items.map(v => v.type === 'folder'
    ? foldersService.copy(v.id, id.slice(1))
      .then(res => refresh()
        .then(() => dispatch(closeFolderTree()) || alert(res.data)))
    : filesService.copy(v.id, id.slice(1))
      .then(res => refresh()
        .then(() => dispatch(closeFolderTree()) || alert(res.data))))

  const submit = async e => {
    e.preventDefault()

    const target = showedFolders.find(v => v._id === id)

    await foldersService.create({ name, path: target ? helper.toPath(target) : '/' })
    const oldFolders = folders
    const newFolders = await refresh()

    dispatch(setNew(false))
    dispatch(setShowedFolders(showedFolders
      .concat(newFolders
        .filter(v => oldFolders
          .every(o => o._id !== v._id)))))
  }

  return <section className="section-floating-aside">
    <div className="col-8"></div>
    <aside className="aside-right col-4">
      <span className="command-bar">
        <span className="primary-command">
          {action === 'move' && <button className="btn-move" onClick={move}><DriveFileMoveIcon />&nbsp;Move</button>}
          {action === 'copy' && <button className="btn-copy" onClick={copy}>{type === 'folder' ? <FolderCopyIcon /> : <FileCopyIcon />}&nbsp;Copy</button>}
          <button className="btn-new-folder" onClick={create}><CreateNewFolderIcon />&nbsp;New</button>
        </span>
        <span className="middle-command">
        </span>
        <span className="secondary-command">
          <button className="btn-close" type="button" onClick={() => dispatch(closeFolderTree())}><CloseIcon /></button>
        </span>
      </span>
      <main className="main-folder-tree">
        <div className="list-group">
          <div>
            <button type="button" className="list-group-item list-group-item-action active open" id="TRoot" value="/" onClick={select}>
              {showedFolders.filter(v => helper.toPath(v)).length ? <ExpandMoreIcon /> : <NavigateNextIcon />}
              <img src="/logo.svg" alt="CloudDrive16 logo" width="30" onClick={toggle} />&nbsp;&nbsp;My files
            </button>
            {(_new && id === 'TRoot') && <button type="button" className="list-group-item list-group-item-action" style={{ marginLeft: '40px' }}>
              <form className="form-horizontal" onSubmit={submit}>
                <img className="folder" src="/svgs/folder.svg" alt="" />
                &nbsp;&nbsp;
                <input type="text" name="name" id="newFolder" placeholder="Enter your folder name" onChange={e => dispatch(setName(e.target.value))} />
                &nbsp;&nbsp;
                <input className="submit-create" type="submit" value="Create" />
              </form>
            </button>}
          </div>
          {Array.from(showedFolders)
            .sort((a, b) => helper.toPath(a) === helper.toPath(b) ? 0 : helper.toPath(a) < helper.toPath(b) ? -1 : 1)
            .map((v, i) => <div key={i}>
              <button type="button" className="list-group-item list-group-item-action" id={v._id} key={i} style={{ marginLeft: `${((helper.toPath(v).match(/\//g) || []).length - 1) * 40}px` }} onClick={select}>
                {!!folders.filter(s => s.path === helper.toPath(v)).length
                  ? showedFolders.filter(s => s.path === helper.toPath(v)).length ? <ExpandMoreIcon /> : <NavigateNextIcon />
                  : <span style={{ width: '24px' }}></span>}
                <img className="folder" src="/svgs/folder.svg" alt="" />&nbsp;&nbsp;{v.name}
              </button>
              {(_new && id === v._id) && <button type="button" className="list-group-item list-group-item-action" style={{ marginLeft: `${((helper.toPath(v).match(/\//g) || []).length) * 40}px` }}>
                <form className="form-horizontal" onSubmit={submit}>
                  <img className="folder" src="/svgs/folder.svg" alt="" />
                  &nbsp;&nbsp;
                  <input type="text" name="name" id="newFolder" placeholder="Enter your folder name" onChange={e => dispatch(setName(e.target.value))} />
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
