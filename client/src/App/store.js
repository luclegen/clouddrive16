import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './components/Counter/counterSlice'
import headerReducer from './components/Header/slice'
import homeReducer from './components/Home/slice'
import loginReducer from './components/Login/slice'
import registerReducer from './components/Register/slice'
import activateReducer from './components/Activate/slice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    header: headerReducer,
    home: homeReducer,
    login: loginReducer,
    register: registerReducer,
    activate: activateReducer,
  },
})
