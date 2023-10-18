import React, { useEffect } from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { Progress } from 'reactstrap';
import {
  selectFactor,
  setFactor
} from './slice';
import helper from '../../services/helper';

export default function Media(props) {
  const dispatch = useDispatch()

  const factor = useSelector(selectFactor)

  useEffect(() => {
    window.onkeyup = e => {
      switch (e.keyCode) {
        case 32:
          props.type === 'video'
            && (document.querySelector('.video').paused
              ? document.querySelector('.video').play()
              : document.querySelector('.video').pause())
          props.type === 'audio'
            && (document.querySelector('.audio').paused
              ? document.querySelector('.audio').play()
              : document.querySelector('.audio').pause())
          break;

        case 37:
          props.prev()
          break;

        case 39:
          props.next()
          break;

        default:
          break;
      }
    }

    if (props.type === 'image' || props.type === 'video') {
      const image = document.querySelector(`.${props.type}`)
      const bgMedia = document.querySelector('.bg-media')

      image.clientWidth / image.clientHeight > bgMedia.clientWidth / bgMedia.clientHeight
        ? image.style.width = '100vw'
        : image.style.height = 'calc(100vh - 53px)'

      document.querySelector('body').style.overflow = 'hidden'
    }
  }, [props.type])

  const download = () => window.open(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/d/` + helper.getQuery('fid'))

  const refresh = () => {
    if (props.type === 'image') {
      const image = document.querySelector('.image')
      const bgMedia = document.querySelector('.bg-media')

      image.style.height = 'auto'
      image.style.width = 'auto'
      image.style.transform = 'rotate(' + (factor * 90) + 'deg)'

      factor % 2
        ? image.clientHeight / image.clientWidth > bgMedia.clientWidth / bgMedia.clientHeight
          ? image.style.height = '100vw'
          : image.style.width = 'calc(100vh - 53px)'
        : image.clientWidth / image.clientHeight > bgMedia.clientWidth / bgMedia.clientHeight
          ? image.style.width = '100vw'
          : image.style.height = 'calc(100vh - 53px)'
    }
  }

  const rotateLeft = () => {
    dispatch(setFactor(factor + 1))
    refresh()
  }

  const rotateRight = () => {
    dispatch(setFactor(factor - 1))
    refresh()
  }

  const prev = () => new Promise(resolve => {
    dispatch(setFactor(0))
    resolve()
  })
    .then(() => {
      props.prev()
      refresh()
    })

  const next = () => new Promise(resolve => {
    dispatch(setFactor(0))
    resolve()
  })
    .then(() => {
      props.next()
      refresh()
    })

  return <section className="section-floating">
    <span className="command-bar">
      <span className="primary-command">
        <button className="btn-download" type="button" onClick={download}><i className="material-icons">download</i>Download</button>
        {props.type === 'image' && <button className="btn-rotate-left" type="button" onClick={rotateLeft}><i className="material-icons">rotate_90_degrees_ccw</i>Rotate left 90°</button>}
        {props.type === 'image' && <button className="btn-rotate-right" type="button" onClick={rotateRight}><i className="material-icons">rotate_90_degrees_cw</i>Rotate right 90°</button>}
        {props.type !== 'image' && <span className="left-space" style={{ width: '56px' }}></span>}
      </span>
      <span className="middle-command">
        <i className="material-icons">{props.type === 'image' ? 'image' : props.type === 'video' ? 'video_file' : props.type === 'audio' ? 'audio_file' : 'none'}</i>
        <strong>&nbsp;{props.src.split('/')[props.src.split('/').length - 1]}</strong>
      </span>
      <span className="secondary-command">
        {props.type === 'image' && <span className="right-space" style={{ width: '270px' }}></span>}
        <button className="btn-prev" type="button" disabled={props.index === 1} onClick={prev}><i className="material-icons">skip_previous</i></button>
        <span className="span-index">&nbsp;&nbsp;{props.index + '/' + props.count}&nbsp;&nbsp;</span>
        <button className="btn-next" type="button" disabled={props.index === props.count} onClick={next}><i className="material-icons">skip_next</i></button>
        <button className="btn-close" type="button" onClick={props.close}><i className="material-icons">close</i></button>
      </span>
    </span>
    {!!props.percent && <Progress value={props.percent} />}
    <span className="bg-media">
      {props.type === 'image'
        ? <img className="image" src={props.src} alt="Image0" />
        : props.type === 'video'
          ? < video className="video" src={props.src} autoPlay controls />
          : props.type === 'audio'
            ? <audio className="audio" src={props.src} autoPlay controls></audio>
            : <span></span>}
    </span>
  </section>
}
