import axios from 'axios'
import helper from '../services/helper'

const API = axios.create()

API.interceptors.request.use(
  async config => {
    config.headers = {
      'Authorization': `Bearer ${helper.getToken()}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    return config
  },
  err => Promise.reject(err)
)

API.interceptors.response.use(res => res, async err => {
  if (err.response.status === 440 && window.confirm(err.response.data.msg)) {
    localStorage.clear()
    if (window.location.href !== process.env.REACT_APP_CLIENT_URL) window.open('/')
    else window.location.reload()
  } else alert(err.response ? err.response.data.msg : err)
  return Promise.reject(err)
})

export default API