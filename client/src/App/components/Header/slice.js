import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

const initialState = {
  width: window.innerWidth,
  hover: false,
  keyword: '',
  opened: false,
  isOpen: false,
  foundFolders: [],
  foundFiles: [],
  keyword: ''
}

export const search = createAsyncThunk('header/search', async (keyword = '') => ({ folders: (await foldersService.list(keyword)).data, files: (await filesService.list(keyword)).data }))

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    toggle: state => { state.hover = !state.hover },
    setOpened: (state, action) => { state.opened = action.payload },
    toggleDropdown: state => { state.isOpen = !state.isOpen },
    hideDropdown: state => { state.isOpen && (state.isOpen = false) },
    setWidth: state => { state.width = window.innerWidth },
    setFoundFolders: (state, action) => { state.foundFolders = action.payload },
    setFoundFiles: (state, action) => { state.foundFiles = action.payload },
    setKeyword: (state, action) => { state.keyword = action.payload }
  },
  extraReducers: builder => builder
    .addCase(search.fulfilled, (state, action) => {
      if (state.keyword) [state.foundFolders, state.foundFiles] = Object.values(action.payload)
      else[state.foundFolders, state.foundFiles] = []
    })
})

export const {
  toggle,
  toggleDropdown,
  hideDropdown,
  setOpened,
  setWidth,
  setKeyword,
  setFoundFolders,
  setFoundFiles
} = headerSlice.actions

export const selectHover = state => state.header.hover
export const selectWidth = state => state.header.width
export const selectOpened = state => state.header.opened
export const selectIsOpen = state => state.header.isOpen
export const selectKeyword = state => state.header.keyword
export const selectFoundFolders = state => state.header.foundFolders
export const selectFoundFiles = state => state.header.foundFiles

export default headerSlice.reducer
