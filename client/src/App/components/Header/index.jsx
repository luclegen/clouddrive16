import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectHover,
  selectWidth,
  selectOpened,
  selectAvatar,
  toggle,
  toggleDropdown,
  search,
  setOpened,
  setWidth,
  selectIsOpen,
  hideDropdown
} from './slice'
import {
  clear,
  list,
  reset
} from '../Files/slice'
import {
  selectLoggedIn,
  logout,
  selectIsActivate
} from '../../slice'
import helper from '../../services/helper'

export default function Header() {
  const dispatch = useDispatch()

  const hover = useSelector(selectHover)
  const width = useSelector(selectWidth)
  const opened = useSelector(selectOpened)
  const isOpen = useSelector(selectIsOpen)
  const avatar = useSelector(selectAvatar)
  const loggedIn = useSelector(selectLoggedIn)
  const activated = useSelector(selectIsActivate)

  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    window.onresize = () => dispatch(setWidth())
    window.onclick = e => {
      !e.target.closest('.dropdown-toggle-avatar')
        && !e.target.closest('.dropdown-menu-avatar')
        && dispatch(hideDropdown())

      e.target.closest('.dropdown-menu-folder')
        ? (e.target.closest('.dropdown-item-normal') || e.target.closest('.dropdown-item-danger'))
        && document.querySelector('.dropdown-menu-folder')
        && (document.querySelector('.dropdown-menu-folder').style.display = 'none')
        : document.querySelector('.dropdown-menu-folder')
        && (document.querySelector('.dropdown-menu-folder').style.display = 'none')

      !e.target.closest('.li-folder') && !e.target.closest('.li-file')
        && dispatch(clear())
    }
  }, [])

  const coloring = e => {
    // if (e.type === 'select') setState({ selected: true })
    // if (e.type === 'blur') setState({ selected: false })

    // if (width > 800) {
    //   let color = keyword || selected || e.type === 'mouseenter' ? 'white' : '#e1dfdd'

    //   if (e.type === 'select') color = 'white'
    //   if (e.type === 'blur' && !keyword) color = '#e1dfdd'
    //   document.querySelector('.search-bar').style.background = color
    // } else if (e.type === 'mouseleave') {
    //   reset()
    //   setState({ opened: false })
    // }
  }

  const getSearchBar = () => document.querySelector('.search-bar')

  const getSearchIn = () => document.querySelector('.input-search')

  const getSearchBtn = () => document.querySelector('.btn-search')

  const open = () => {
    if (width < 801) {
      getSearchBar().style.position = 'absolute'
      getSearchBar().style.width = '100%'
      getSearchBar().style.left = '0'
      getSearchBar().style.background = 'white'
      getSearchIn().style.display = 'block'
      getSearchIn().focus()
      getSearchBtn().style.color = 'blue'

      dispatch(setOpened(true))
    }
  }

  // search = e => e.target.value
  //   ? foldersService.list(e.target.value)
  //     .then(res => new Promise(resolve => setState({ foundFolders: res.data }) || resolve())
  //       .then(() => filesService.list(e.target.value)
  //         .then(res => setState({ foundFiles: res.data }))))
  //   : setState({ foundFolders: [], foundFiles: [] })

  return <header>
    <Link className="logo" to={`/${loggedIn && activated ? '?id=root' : ''}`} onClick={() => loggedIn && activated && dispatch(list())} onMouseEnter={() => dispatch(toggle())} onMouseLeave={() => dispatch(toggle())}>
      <img className={`logo-img ${width > 560 && 'me-1'}`} src="logo.svg" alt="Logo" hidden={hover} />
      <img className={`logo-img ${width > 560 && 'me-1'}`} src="logo.hover.svg" alt="Hover logo" hidden={!hover} />
      {width > 560 && process.env.REACT_APP_NAME}
    </Link>
    {loggedIn && <div className="search-bar" onMouseEnter={coloring} onMouseLeave={coloring} onInput={e => dispatch(search(e.target.value))}>
      <form className="form-search">
        <button className="btn-search" type={width > 800 ? 'submit' : opened && keyword ? 'submit' : 'button'} disabled={width > 800 && !keyword} onClick={open}>
          <i className="material-icons">search</i>
        </button>
        <input className="input-search" name="keyword" type="search" value={keyword} placeholder="Search for anything" onSelect={coloring} onBlur={coloring} onInput={e => setKeyword(e.target.value)} />
      </form>
      {/* <div className="list-group-search">
        {foundFolders?.map((v, i) => <button type="button" className="list-group-item-folder" id={v._id} key={i} onClick={access}>
          <img className="folder" src="/svg/folder.svg" alt="Folder" /> &nbsp;&nbsp;{v.name}
        </button>)}
        {foundFiles?.map((v, i) => <button type="button" className="list-group-item-file" id={v._id} key={i} name={v.name} value={v.path} data-trash={v.is_trash} onClick={access}>
          <i className="material-icons">{helper.isImage(v.name) ? 'image' : helper.isVideo(v.name) ? 'video_file' : helper.isAudio(v.name) ? 'audio_file' : 'description'}</i>&nbsp;&nbsp;{v.name}
        </button>)}
      </div> */}
    </div>}
    <div className="dropdown dropdown-avatar">
      {loggedIn
        ? <button className="dropdown-toggle dropdown-toggle-avatar" title={helper.getCookie('first_name')} onClick={() => dispatch(toggleDropdown())}>
          {avatar
            ? <img className="avatar-img" src={avatar} alt={`${helper.getCookie('first_name')}'s avatar`} />
            : <i className="material-icons">account_circle</i>}
        </button>
        : <a className="link-help" href="/help" target="_blank">
          <i className="material-icons">help_outline</i>
        </a>}
      {isOpen && <ul className="dropdown-menu dropdown-menu-avatar">
        <Link className="dropdown-item-normal dropdown-item" to="/profile" onClick={() => dispatch(hideDropdown())}><p className="text-profile">My profile</p><i className="material-icons">info</i></Link>
        <hr className="dropdown-divider" />
        <Link className="dropdown-item-normal dropdown-item" to="/help" onClick={() => dispatch(hideDropdown())}><p className="text-help">Help</p><i className="material-icons">help_outline</i></Link>
        <hr className="dropdown-divider" />
        <Link className="dropdown-item-danger dropdown-item" to="/" onClick={() => dispatch(reset()) && dispatch(logout()) && dispatch(hideDropdown())}><p className="text-logout">Sign out</p><i className="material-icons">logout</i></Link>
      </ul>}
    </div>
  </header>
}
