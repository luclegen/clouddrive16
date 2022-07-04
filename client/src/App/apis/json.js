import axios from 'axios'

const API = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

API.interceptors.response.use(res => res, err => {
  err.response
    ? alert(typeof err.response?.data === 'object'
      ? JSON.stringify(err.response?.data)
      : err.response?.data || err.response?.statusText)
    || (err.response.status === 501 && window.location.reload())
    : console.error(err)

  return Promise.reject(err)
})

export default API