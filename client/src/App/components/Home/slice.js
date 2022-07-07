import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../../services/auth'
import helper from '../../services/helper'

const initialState = {
  available: true,
  remember: false,
  loggedIn: helper.loggedIn(),
  is_activate: helper.getCookie('is_activate') === 'true',
}

export const check = createAsyncThunk('home/check', async email => (await authService.available(email)).status === 200)
export const login = createAsyncThunk('home/login', async user => (await authService.login(user)).data)
export const logout = createAsyncThunk('home/logout', async () => (await authService.logout()).data)
export const verify = createAsyncThunk('home/verify', async code => (await authService.verify(code)).data)

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setRemember: (state, action) => { state.remember = action.payload },
  },
  extraReducers: builder => builder
    .addCase(check.fulfilled, (state, action) => {
      state.available = action.payload
    })
    .addCase(login.pending, state => {
      state.remember = false
    })
    .addCase(login.fulfilled, (state, action) => {
      helper.setCookies(action.payload, state.remember ? 365 * 24 * 60 * 60 : 0)
      !action.payload.is_activate && alert('Your session exists for 5 minutes.')
      state.is_activate = action.payload.is_activate
      state.loggedIn = true
    })
    .addCase(verify.fulfilled, state => {
      state.is_activate = true
    })
    .addCase(verify.rejected, () => {
      document.querySelector('.form-only').reset()
      document.querySelector('.form-control-digit').focus()
    })
    .addCase(logout.fulfilled, state => {
      state.loggedIn = false
    }),
})

export const { setRemember } = homeSlice.actions

export const selectAvailable = state => state.home.available
export const selectRemember = state => state.home.remember
export const selectLoggedIn = state => state.home.loggedIn
export const selectIsActivate = state => state.home.is_activate

export default homeSlice.reducer
