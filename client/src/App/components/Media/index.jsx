import React, { useEffect } from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Progress } from 'reactstrap';
import SaveIcon from '@mui/icons-material/Save'
import DownloadIcon from '@mui/icons-material/Download'
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw'
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw'
import ImageIcon from '@mui/icons-material/Image'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import CloseIcon from '@mui/icons-material/Close'
import {
  selectFactor,
  setFactor
} from './slice';
import FileType from '../../models/FileType';
import helper from '../../services/helper';
import {
  readPlaintext,
  savePlaintext,
  selectData,
  selectDataPrev,
  setData
} from '../Files/slice';

export default function Media(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation();

  const factor = useSelector(selectFactor)
  const data = useSelector(selectData)
  const dataPrev = useSelector(selectDataPrev)

  window.onbeforeunload = () => data !== dataPrev ? true : undefined

  useEffect(() => {
    window.onkeyup = e => {
      switch (e.keyCode) {
        case 32:
          props.type === FileType.VIDEO
            && (document.querySelector('.video').paused
              ? document.querySelector('.video').play()
              : document.querySelector('.video').pause())
          props.type === FileType.AUDIO
            && (document.querySelector('.audio').paused
              ? document.querySelector('.audio').play()
              : document.querySelector('.audio').pause())
          break;

        case 37:
          if (props.type !== FileType.TXT) props.prev()
          break;

        case 39:
          if (props.type !== FileType.TXT) props.next()
          break;

        case 83:
          if (e.ctrlKey) save()
          break;

        default:
          break;
      }
    }

    if (props.type === FileType.IMAGE || props.type === FileType.VIDEO) {
      const image = document.querySelector(`.${props.type}`)
      const bgMedia = document.querySelector('.bg-media')

      image.clientWidth / image.clientHeight > bgMedia.clientWidth / bgMedia.clientHeight
        ? image.style.width = '100vw'
        : image.style.height = 'calc(100vh - 53px)'

      document.querySelector('body').style.overflow = 'hidden'
    }

    if (props.type === FileType.TXT) dispatch(readPlaintext(helper.getQuery('fid')))
  }, [props.type])

  const download = () => window.open(`${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/d/` + helper.getQuery('fid'))

  const refresh = () => {
    if (props.type === FileType.IMAGE) {
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

  const save = async () => (await dispatch(savePlaintext({ id: helper.getQuery('fid'), data }))).payload

  return <section className="section-floating">
    <span className="command-bar">
      <span className="primary-command">
        {props.type === FileType.TXT && <button className="btn-save" type="button" disabled={data === dataPrev} onClick={save}><SaveIcon />&nbsp;Save</button>}
        <button className="btn-download" type="button" onClick={download}><DownloadIcon />&nbsp;{t('Download')}</button>
        {props.type === FileType.IMAGE && <button className="btn-rotate-left" type="button" onClick={rotateLeft}><Rotate90DegreesCcwIcon />&nbsp;{t('Rotate left 90°')}</button>}
        {props.type === FileType.IMAGE && <button className="btn-rotate-right" type="button" onClick={rotateRight}><Rotate90DegreesCwIcon />&nbsp;{t('Rotate right 90°')}</button>}
        {props.type !== FileType.IMAGE && props.type !== FileType.TXT && <span className="left-space" style={{ width: '56px' }}></span>}
      </span>
      <span className="middle-command">
        {props.type === FileType.IMAGE ? <ImageIcon /> : props.type === FileType.VIDEO ? <VideoFileIcon /> : props.type === FileType.AUDIO ? <AudioFileIcon /> : props.type === FileType.NONE ? 'none' : ''}
        <strong>&nbsp;{props.src.split('/')[props.src.split('/').length - 1]}</strong>
      </span>
      <span className="secondary-command">
        {(props.type === FileType.IMAGE || props.type === FileType.TXT) && <span className="right-space" style={{ width: `${props.type === FileType.TXT ? 25 : 270}px` }}></span>}
        <button className="btn-prev" title={t('Previous')} type="button" disabled={props.index === 1} onClick={() => {
          if (props.type === FileType.TXT) {
            if (data === dataPrev) prev()
            else {
              if (confirm('Are you sure to previous?\nChanges you made may not be saved.')) prev()
            }
          } else prev()
        }}><SkipPreviousIcon /></button>
        <span className="span-index">&nbsp;&nbsp;{props.index + '/' + props.count}&nbsp;&nbsp;</span>
        <button className="btn-next" title={t('Next')} type="button" disabled={props.index === props.count} onClick={() => {
          if (props.type === FileType.TXT) {
            if (data === dataPrev) next()
            else {
              if (confirm('Are you sure to next?\nChanges you made may not be saved.')) next()
            }
          } else next()
        }}><SkipNextIcon /></button>
        <button className="btn-close" title={t('Close')} type="button" onClick={() => {
          if (props.type === FileType.TXT) {
            if (data === dataPrev) props.close()
            else {
              if (confirm('Are you sure to close?\nChanges you made may not be saved.')) props.close()
            }
          } else props.close()
        }}><CloseIcon /></button>
      </span>
    </span>
    {!!props.percent && <Progress value={props.percent} />}
    <span className="bg-media">
      {props.type === FileType.IMAGE
        ? <img className="image" src={props.src} alt="Image0" />
        : props.type === FileType.VIDEO
          ? < video className="video" src={props.src} autoPlay controls />
          : props.type === FileType.AUDIO
            ? <audio className="audio" src={props.src} autoPlay controls></audio>
            : props.type === FileType.TXT
              ? <textarea className="text-editor" name="text-editor" id="textEditor" value={data} onChange={e => dispatch(setData(e.target.value))}></textarea>
              : <span></span>
      }
    </span>
  </section >
}
