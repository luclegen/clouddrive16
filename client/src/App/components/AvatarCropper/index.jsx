import React from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import ReactAvatarCropper from 'react-avatar-edit'
import {
  selectSrc,
  setPreview,
  setSrc
} from './slice'

export default function AvatarCropper() {
  const dispatch = useDispatch()

  const src = useSelector(selectSrc)

  const close = () => {
    dispatch(setPreview(null))
    dispatch(setSrc(null))
  }

  const crop = view => dispatch(setPreview(view))

  return <div className="avatar-cropper">
    <ReactAvatarCropper
      width={200}
      height={200}
      onClose={close}
      onCrop={crop}
      src={src}
    />
  </div>
}
