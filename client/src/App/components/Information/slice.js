import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import usersService from '../../services/users'

const initialState = {
  edit: false
}

export const readUser = createAsyncThunk('information/readUser', async id => ((await usersService.read(id)).data))
export const updateUser = createAsyncThunk('information/updateUser', async user => ((await usersService.update(user)).data))

export const informationSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {
    setShow: (state, action) => { state.show = action.payload },
    setEdit: (state, action) => { state.edit = action.payload }
  },
  extraReducers: builder => builder
    .addCase(updateUser.fulfilled, (state, action) => {
      alert(action.payload)
    })
})

export const {
  setEdit
} = informationSlice.actions

export const selectEdit = state => state.information.edit

export default informationSlice.reducer
