import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slice'
import homeReducer from './pages/Home/slice'
import profileReducer from './pages/Profile/slice'
import informationReducer from './components/Information/slice'
import headerReducer from './components/Header/slice'
import loginReducer from './components/Login/slice'
import registrationReducer from './components/Registration/slice'
import activateReducer from './components/Activate/slice'
import filesReducer from './components/Files/slice'
import progressReducer from './components/Progress/slice'
import folderTreeReducer from './components/FolderTree/slice'
import mediaReducer from './components/Media/slice'
import avatarCropperReducer from './components/AvatarCropper/slice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    header: headerReducer,
    home: homeReducer,
    profile: profileReducer,
    information: informationReducer,
    login: loginReducer,
    registration: registrationReducer,
    activate: activateReducer,
    files: filesReducer,
    progress: progressReducer,
    folderTree: folderTreeReducer,
    media: mediaReducer,
    avatarCropper: avatarCropperReducer
  }
});
