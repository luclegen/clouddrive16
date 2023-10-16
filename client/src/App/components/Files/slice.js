import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import helper from '../../services/helper'
import foldersService from '../../services/folders'
import filesService from '../../services/files'

const initialState = {
  folders: [],
  files: [],
  items: [],
  itemFolders: [],
  itemFiles: [],
  itemPrev: null,
  path: '',
  index: -1,
  media: '',
  body: '',
  type: 'none',
  factor: 0
}

export const list = createAsyncThunk('files/list', async () => ({ folders: (await foldersService.list()).data, files: (await filesService.list()).data }))
export const createFolder = createAsyncThunk('files/createFolder', async folder => (await foldersService.create(folder)).data)
export const deleteFolder = createAsyncThunk('files/deleteFolder', async id => (await foldersService.delete(id)).data)
export const deleteForeverFolder = createAsyncThunk('files/deleteForeverFolder', async id => (await foldersService.deleteForever(id)).data)
export const createPlaintext = createAsyncThunk('files/createPlaintext', async file => (await filesService.createPlaintext(file)).data)
export const readFile = createAsyncThunk('files/readFile', async id => (await filesService.read(id)).data)
export const openFile = createAsyncThunk('files/openFile', async media => (await filesService.open(media)).data)
export const deleteFile = createAsyncThunk('files/deleteFile', async id => (await filesService.delete(id)).data)
export const deleteForeverFile = createAsyncThunk('files/deleteForeverFile', async id => (await filesService.deleteForever(id)).data)

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setPath: (state, action) => { state.path = action.payload },
    setType: (state, action) => { state.type = action.payload },
    setItems: (state, action) => { state.items = action.payload },
    setItemPrev: (state, action) => { state.itemPrev = action.payload },
    clear: state => {
      document.querySelectorAll('.li-folder')
        .forEach(v => v.classList.contains('bg-info') && v.classList.remove('bg-info'))
      document.querySelectorAll('.li-file')
        .forEach(v => v.classList.contains('bg-info') && v.classList.remove('bg-info'))

      state.items = []
      state.setItemPrev = null
    },
    reset: state => {
      document.querySelectorAll('.img')
        .forEach(v => v.setAttribute('src', ''))
      document.querySelectorAll('.video-preview')
        .forEach(v => v.setAttribute('src', ''))
      document.querySelectorAll('.bg-img')
        .forEach(v => v.setAttribute('src', ''))
      document.querySelectorAll('.bg-video')
        .forEach(v => v.setAttribute('src', ''))

      state.itemFolders = state.itemFiles = []
    },
    close: state => {
      document.querySelector('body').style.overflow = 'visible'
      helper.deleteQuery('fid')
        || (state.media = '')
    }
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
    .addCase(readFile.fulfilled, (state, action) => {
      state.media = helper.getMedia(action.payload)
      state.type = helper.getFileType(state.media)
      state.index = state.files
        .filter(v => v.path === state.path && helper.isMedia(v.name))
        .map(v => helper.getMedia(v))
        .findIndex(v => v === state.media) + 1
    })
    .addCase(openFile.fulfilled, (state, action) => {
      helper.isPDF(state.media)
        && window.open(state.media)
        && (state.media = '')
      helper.isPlaintext(state.media)
        && (state.body = action.payload)
    })
})

export const { setPath, setItems, setItemPrev, clear, reset, close } = filesSlice.actions

export const selectFolders = state => state.files.folders
export const selectFiles = state => state.files.files
export const selectItems = state => state.files.items
export const selectItemFolders = state => state.files.itemFolders
export const selectItemFiles = state => state.files.itemFiles
export const selectItemPrev = state => state.files.itemPrev
export const selectPath = state => state.files.path
export const selectMedia = state => state.files.media
export const selectType = state => state.files.type
export const selectMediaFiles = state => state.files.files.filter(v => v.path === state.files.path && helper.isMedia(v.name))
export const selectMedias = state => state.files.files.filter(v => v.path === state.files.path && helper.isMedia(v.name)).map(v => helper.getMedia(v))
export const selectIndex = state => state.files.index
export const selectFactor = state => state.files.factor

export default filesSlice.reducer
