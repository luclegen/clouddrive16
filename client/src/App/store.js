import { configureStore } from '@reduxjs/toolkit'
import headerReducer from './components/Header/slice'
import homeReducer from './components/Home/slice'
import loginReducer from './components/Login/slice'
import registerReducer from './components/Register/slice'
import activateReducer from './components/Activate/slice'
import filesReducer from './components/Files/slice'
import progressReducer from './components/Progress/slice'

export const store = configureStore({
  reducer: {
    header: headerReducer,
    home: homeReducer,
    login: loginReducer,
    register: registerReducer,
    activate: activateReducer,
    files: filesReducer,
    progress: progressReducer,
  },
})
