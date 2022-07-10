import axios from 'axios'

const formDataAPI = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "multipart/form-data",
  },
})

formDataAPI.interceptors.response.use(res => res, err => {
  err.response
    ? alert(typeof err.response?.data === 'object'
      ? JSON.stringify(err.response?.data)
      : err.response?.data || err.response?.statusText || err.message)
    || (err.response.status === 501 && window.location.reload())
    : console.error(err)

  return Promise.reject(err)
})

export default formDataAPI 