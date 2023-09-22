import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import usersService from '../../services/users'

const initialState = {
}

export const create = createAsyncThunk('registration/create', async user => (await usersService.create(user)).data)

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
  },
  extraReducers: builder => builder
    .addCase(create.fulfilled, (state, action) => { alert(action.payload) })
})

export default registrationSlice.reducer
