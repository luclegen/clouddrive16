import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { showCancel, hideCancel, selectUploadFiles, cancelUpload, hideProgress } from './slice'

export default function Progress(props) {
  const dispatch = useDispatch()

  const uploadFiles = useSelector(selectUploadFiles)

  const cancel = index => () => props.controllers.current[index].abort() || dispatch(cancelUpload(index))

  return <section className="section-floating-aside">
    <div className="col-8"></div>
    <aside className="aside-right col-4">
      <span className="command-bar">
        <span className="primary-command">
        </span>
        <span className="middle-command">
        </span>
        <span className="secondary-command">
          <button className="btn-close-progress" type="button" onClick={() => dispatch(hideProgress())}><i className="material-icons">close</i></button>
        </span>
      </span>
      <main className="main-aside">
        {!!uploadFiles.length && <ul className="list-group">
          {uploadFiles.map((v, i) =>
            <li key={i} className="list-group-item-upload">
              <label className="label-upload-item" title={v.name}>{v.name}</label>
              {v.show
                ? v.done
                  ? v.success
                    ? <i className="material-icons" title="Done">check_circle</i>
                    : <i className="material-icons" title="Failed">error</i>
                  : <span onMouseEnter={() => dispatch(showCancel(i))}><CircularProgressbar className="circular-progressbar" value={v.value} text={`${v.value}%`} /></span>
                : v.cancel
                  ? <span><i className="material-icons" title="Canceled">cancel</i></span>
                  : <span className="btn-cancel-upload" title="Cancel" onMouseLeave={() => dispatch(hideCancel(i))} onClick={cancel(i)}></span>}
            </li>)}
        </ul>}
      </main>
    </aside>
  </section>
}
