import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import codesService from '../../services/codes'

const initialState = {
  sent: false
}

export const create = createAsyncThunk('activate/create', async () => (await codesService.create()).data)

export const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {},
  extraReducers: builder => builder
    .addCase(create.fulfilled, (state, action) => {
      state.sent = true
      if(process.env.NODE_ENV === 'production') window.open(action.payload)
      else alert(action.payload)
    })
})

export const { toggle, setOpened, toggleDropdown } = activateSlice.actions

export const selectSent = state => state.activate.sent

export default activateSlice.reducer
