import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import helper from '../../services/helper'
import codesService from '../../services/codes'
import authService from '../../services/auth'

const initialState = {
  sent: false,
}

export const create = createAsyncThunk('activate/create', async () => (await codesService.create()).data)

export const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {},
  extraReducers: builder => builder
    .addCase(create.fulfilled, (state, action) => {
      state.sent = true
      window.open(action.payload)
    })
})

export const { toggle, setOpened, toggleDropdown } = activateSlice.actions

export const selectSent = state => state.activate.sent

export default activateSlice.reducer
