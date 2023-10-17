import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import helper from '../../services/helper'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

const initialState = {
  show: false,
  oldFolders: [],
  folders: [],
  showedFolders: [],
  new: false,
  id: 'TRoot',
  name: ''
}

export const list = createAsyncThunk('folderTrees/list', async () => ({ folders: (await foldersService.list()).data, files: (await filesService.list()).data }))

export const folderTreeSlice = createSlice({
  name: 'folderTree',
  initialState,
  reducers: {
    setNew: (state, action) => { state.new = action.payload },
    setId: (state, action) => { state.id = action.payload },
    setShowedFolders: (state, action) => { state.showedFolders = action.payload },
    setOldFolders: (state, action) => { state.oldFolders = action.payload },
    setName: (state, action) => { state.name = action.payload },
    setFolders: (state, action) => { state.folders = action.payload },
    close: state => { state.show = false },
    open: state => { state.show = true }
  },
  extraReducers: builder => builder
    .addCase(list.fulfilled, (state, action) => {
      [state.folders, state.files] = Object.values(action.payload)

      const folder = helper.getQuery('id') === 'root'
        ? { path: '/', name: '' }
        : state.folders.find(f => f._id === helper.getQuery('id'))

      state.path = folder?.name === ''
        ? '/'
        : helper.toPath(folder)

      state.itemFolders = helper.getQuery('location') === 'trash'
        ? state.folders.filter(v => v.is_trash)
        : helper.getQuery('keyword')
          ? state.folders.filter(v => !v.is_trash && (new RegExp(helper.getQuery('keyword'), 'ig').test(v.name)))
          : state.folders.filter(v => !v.is_trash && v.path === state.path)

      state.itemFiles = helper.getQuery('location') === 'trash'
        ? state.files.filter(v => v.is_trash)
        : helper.getQuery('keyword')
          ? state.files.filter(v => !v.is_trash && (new RegExp(helper.getQuery('keyword'), 'ig').test(v.name)))
          : state.files.filter(v => !v.is_trash && v.path === state.path)

      document.title = `${helper.getQuery('keyword')
        ? `Search results for "${helper.getQuery('keyword')}"`
        : helper.getQuery('location') === 'trash'
          ? 'Trash'
          : helper.getQuery('id') === 'root'
            ? 'My files'
            : state.folders.find(v => v._id === helper.getQuery('id'))?.name}
         - ${process.env.REACT_APP_NAME}`

      !window.location.search && helper.setQuery('id', 'root')

      if (helper.getQuery('fid')) {
        const media = helper.getMedia(state.files.find(v => v._id === helper.getQuery('fid')))

        state.index = state.files
          .filter(v => v.path === state.path && helper.isMedia(v.name))
          .map(v => helper.getMedia(v))
          .findIndex(v => v === media) + 1
        state.media = media
        state.type = helper.getFileType(media)
      }
    })
})

export const { setNew, setId, setShowedFolders, setOldFolders, setName, setFolders, close, open } = folderTreeSlice.actions

export const selectShow = state => state.folderTree.show
export const selectNew = state => state.folderTree.new
export const selectId = state => state.folderTree.id
export const selectFolders = state => state.folderTree.folders
export const selectOldFolders = state => state.folderTree.oldFolders
export const selectShowedFolders = state => state.folderTree.showedFolders
export const selectName = state => state.folderTree.name

export default folderTreeSlice.reducer
