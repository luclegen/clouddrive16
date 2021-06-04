import axios from 'axios'

const API = axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  }
})

API.interceptors.response.use(res => res, async err => {
  alert(err.response ? err.response.data.msg : err)
  return Promise.reject(err)
})

export default API