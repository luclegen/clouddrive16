import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slice'
import headerReducer from './components/Header/slice'
import homeReducer from './pages/Home/slice'
import loginReducer from './components/Login/slice'
import registrationReducer from './components/Registration/slice'
import activateReducer from './components/Activate/slice'
import filesReducer from './components/Files/slice'
import progressReducer from './components/Progress/slice'
import folderTreeReducer from './components/FolderTree/slice'
import mediaReducer from './components/Media/slice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    header: headerReducer,
    home: homeReducer,
    login: loginReducer,
    registration: registrationReducer,
    activate: activateReducer,
    files: filesReducer,
    progress: progressReducer,
    folderTree: folderTreeReducer,
    media: mediaReducer
  }
});
