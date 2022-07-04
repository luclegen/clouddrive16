import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import helper from '../../services/helper'
import codesService from '../../services/codes'
import authService from '../../services/auth'

const initialState = {
  sent: false,
  is_activate: helper.getCookie('is_activate') === 'true',
}

export const create = createAsyncThunk('activate/create', async () => (await codesService.create()).data)
export const verify = createAsyncThunk('activate/verify', async code => (await authService.verify(code)).data)

export const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {},
  extraReducers: builder => builder
    .addCase(create.fulfilled, (state, action) => {
      state.sent = true
      window.open(action.payload)
    })
    .addCase(verify.fulfilled, state => {
      state.is_activate = true
    })
    .addCase(verify.rejected, () => {
      document.querySelector('.form-only').reset()
      document.querySelector('.form-control-digit').focus()
    })
})

export const { toggle, setOpened, toggleDropdown } = activateSlice.actions

export const selectSent = state => state.activate.sent
export const selectIsActivate = state => state.activate.is_activate

export default activateSlice.reducer
