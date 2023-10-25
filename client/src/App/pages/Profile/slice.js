import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show: false,
  edit: false
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setShow: (state, action) => { state.show = action.payload },
    setEdit: (state, action) => { state.edit = action.payload }
  }
})

export const {
  setShow,
  setEdit
} = profileSlice.actions

export const selectShow = state => state.profile.show
export const selectEdit = state => state.profile.edit

export default profileSlice.reducer
