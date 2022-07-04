import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../../services/auth'
import helper from '../../services/helper'

const initialState = {
  opened: false,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    open: state => { state.opened = true },
    close: state => { state.opened = false },
  },
})

export const { setRemember, open, close } = loginSlice.actions

export const selectOpened = state => state.login.opened

export default loginSlice.reducer
