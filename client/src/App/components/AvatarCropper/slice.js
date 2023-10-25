import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  src: null,
  preview: null
}

export const avatarCropperSlice = createSlice({
  name: 'avatarCropper',
  initialState,
  reducers: {
    setSrc: (state, action) => { state.src = action.payload },
    setPreview: (state, action) => { state.preview = action.payload }
  }
})

export const {
  setSrc,
  setPreview
} = avatarCropperSlice.actions

export const selectSrc = state => state.avatarCropper.src
export const selectPreview = state => state.avatarCropper.preview

export default avatarCropperSlice.reducer
