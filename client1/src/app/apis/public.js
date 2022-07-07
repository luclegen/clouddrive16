import axios from 'axios'

const API = axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  }
})

API.interceptors.response.use(res => res, async err => {
  err.response ? alert(err.response.data.msg) : console.warn(err)
  return Promise.reject(err)
})

export default API