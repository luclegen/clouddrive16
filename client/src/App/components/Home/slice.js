import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../../services/auth'
import helper from '../../services/helper'

const initialState = {
  available: true,
  remember: false,
  loggedIn: helper.loggedIn(),
}

export const check = createAsyncThunk('home/check', async email => (await authService.available(email)).status === 200)
export const login = createAsyncThunk('home/login', async user => (await authService.login(user)).data)
export const logout = createAsyncThunk('home/logout', async () => (await authService.logout()).data)

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
      new Promise(resolve => {
        helper.setCookies(action.payload, state.remember ? 365 * 24 * 60 * 60 : 0)
        helper.getCookie('is_activate') === 'false'
          && alert('Your session exists for 5 minutes.')
        window.location.href = '/'

        resolve()
      })
        .then(() => state.loggedIn = true)
    })
    .addCase(logout.fulfilled, state => {
      new Promise(resolve => (window.location.href = '/') && resolve())
        .then(() => state.loggedIn = false)
    }),
})

export const { setRemember } = homeSlice.actions

export const selectAvailable = state => state.home.available
export const selectRemember = state => state.home.remember
export const selectLoggedIn = state => state.home.loggedIn

export default homeSlice.reducer
