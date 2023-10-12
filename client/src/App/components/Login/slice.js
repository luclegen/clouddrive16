import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  opened: false
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    open: state => { state.opened = true },
    close: state => { state.opened = false }
  }
})

export const { setRemember, open, close } = loginSlice.actions

export const selectOpened = state => state.login.opened

export default loginSlice.reducer
