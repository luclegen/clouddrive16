import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import usersService from '../../services/users'

const initialState = {
}

export const create = createAsyncThunk('register/create', async user => (await usersService.create(user)).data)

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
  },
  extraReducers: builder => builder
    .addCase(create.fulfilled, (state, action) => { alert(action.payload) })
})

export default registerSlice.reducer
