import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show: false,
  uploadFiles: [],
  uploading: false
}

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    showProgressComponent: state => { state.show = true },
    hideProgress: state => { state.show = false },
    showCancel: (state, action) => {
      const newArr = [...state.uploadFiles]

      newArr[action.payload].show = false

      state.uploadFiles = newArr
    },
    hideCancel: (state, action) => {
      const newArr = [...state.uploadFiles]

      newArr[action.payload].show = true

      state.uploadFiles = newArr
    },
    setUploadFiles: (state, action) => {
      state.uploadFiles = action.payload
    },
    setValue: (state, action) => {
      if (state.uploadFiles.length) {
        const newArr = [...state.uploadFiles]

        newArr[action.payload.index].value = action.payload.value

        state.uploadFiles = newArr
      }
    },
    cancelUpload: (state, action) => {
      if (state.uploading) {
        const newArr = [...state.uploadFiles]

        newArr[action.payload].cancel = true
        newArr[action.payload].done = true

        state.uploadFiles = newArr
      }
    },
    startUpload: state => {
      state.uploading = true
    },
    setSuccess: (state, action) => {
      const newArr = [...state.uploadFiles]

      newArr[action.payload].success = true

      state.uploadFiles = newArr
    },
    finishUpload: (state, action) => {
      if (state.uploading) {
        const newArr = [...state.uploadFiles]

        newArr[action.payload].done = true

        state.uploadFiles = newArr
      }

      state.uploading = !state.uploadFiles.every(v => v.done)
    }
  }
})

export const {
  showProgressComponent,
  hideProgress,
  setUploadFiles,
  setValue,
  showCancel,
  hideCancel,
  startUpload,
  setSuccess,
  finishUpload,
  cancelUpload
} = progressSlice.actions

export const selectShowProgress = state => state.progress.show
export const selectUploadFiles = state => state.progress.uploadFiles
export const selectUploading = state => state.progress.uploading

export default progressSlice.reducer
