import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  width: window.innerWidth,
  hover: false,
  keyword: '',
  opened: false,
  isOpen: false,
  foundFolders: [],
  foundFiles: []
}

export const search = createAsyncThunk(
  'counter/search',
  async keyword => {
    console.log(keyword)
    // const response = await fetchCount(amount)
    // The value we return becomes the `fulfilled` action payload
    // return response.data
  }
)

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    toggle: state => { state.hover = !state.hover },
    setOpened: (state, action) => { state.opened = action.payload },
    toggleDropdown: state => { state.isOpen = !state.isOpen },
    hideDropdown: state => { state.isOpen && (state.isOpen = false) },
    setWidth: state => { state.width = window.innerWidth }
  }
})

export const {
  toggle,
  toggleDropdown,
  hideDropdown,
  setOpened,
  setWidth
} = headerSlice.actions

export const selectHover = state => state.header.hover
export const selectWidth = state => state.header.width
export const selectOpened = state => state.header.opened
export const selectIsOpen = state => state.header.isOpen
export const selectFoundFolders = state => state.header.foundFolders
export const selectFoundFiles = state => state.header.foundFiles

export default headerSlice.reducer
