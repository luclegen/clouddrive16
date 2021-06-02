import axios from 'axios'

export default axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  }
})
