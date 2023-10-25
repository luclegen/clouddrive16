import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './services/auth'
import usersService from './services/users'
import helper from './services/helper'
import Lang from './models/Lang'

const initialState = {
  available: true,
  remember: false,
  loggedIn: helper.loggedIn(),
  is_activate: helper.getCookie('is_activate') === 'true',
  lang: helper.getCookie('lang') || (navigator.language === Lang.VI ? Lang.VI : Lang.EN),
  avatar: helper.getCookie('avatar'),
  first_name: helper.getCookie('first_name'),
  full_name: helper.getCookie('lang') === Lang.VI ? `${helper.getCookie('last_name')} ${helper.getCookie('middle_name')} ${helper.getCookie('first_name')}` : `${helper.getCookie('first_name')} ${helper.getCookie('middle_name')} ${helper.getCookie('last_name')}`
}

export const check = createAsyncThunk('app/check', async (email) => (await authService.available(email)).status === 200)
export const login = createAsyncThunk('app/login', async (user) => (await authService.login(user)).data)
export const logout = createAsyncThunk('app/logout', async () => (await authService.logout()).data)
export const verify = createAsyncThunk('app/verify', async (code) => (await authService.verify(code)).data)
export const changeLang = createAsyncThunk('app/changeLang', async (lang) => (await usersService.changeLang(lang)).data)
export const readUser = createAsyncThunk('app/readUser', async id => ((await usersService.read(id)).data))
export const updateUser = createAsyncThunk('app/updateUser', async user => ((await usersService.update(user)).data))

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRemember: (state, action) => {
      state.remember = action.payload
    },
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload
    },
    setLang: (state, action) => {
      state.lang = action.payload
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload
    },
    setFirstName: (state, action) => {
      state.first_name = action.payload
    },
    setFullName: (state, action) => {
      state.full_name = action.payload
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(check.fulfilled, (state, action) => {
        state.available = action.payload
      })
      .addCase(login.pending, (state) => {
        state.remember = false
      })
      .addCase(login.fulfilled, (state, action) => {
        !action.payload.is_activate &&
          alert('Your session exists for 5 minutes.')
        state.is_activate = action.payload.is_activate
        state.loggedIn = true
      })
      .addCase(verify.fulfilled, (state) => {
        state.is_activate = true
      })
      .addCase(verify.rejected, () => {
        document.querySelector('.form-only').reset()
        document.querySelector('.form-control-digit').focus()
      })
      .addCase(logout.fulfilled, (state) => {
        state.loggedIn = false
      })
      .addCase(changeLang.fulfilled, (state, action) => {
        state.lang = helper.getCookie('lang')
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        alert(action.payload)
      })
})

export const {
  setRemember,
  setLoggedIn,
  setLang,
  setAvatar,
  setFirstName,
  setFullName
} = appSlice.actions

export const selectAvailable = (state) => state.app.available
export const selectRemember = (state) => state.app.remember
export const selectLoggedIn = (state) => state.app.loggedIn
export const selectIsActivate = (state) => state.app.is_activate
export const selectLang = (state) => state.app.lang
export const selectAvatar = (state) => state.app.avatar
export const selectFirstName = (state) => state.app.first_name
export const selectFullName = (state) => state.app.full_name

export default appSlice.reducer
