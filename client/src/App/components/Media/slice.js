import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  factor: 0
}

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setFactor: (state, action) => { state.factor = action.payload }
  }
})

export const { setFactor } = mediaSlice.actions

export const selectFactor = state => state.media.factor

export default mediaSlice.reducer
