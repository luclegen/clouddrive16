import axios from 'axios'

class AuthService {
  register = user => axios.post('auth/register', user)
}

export default new AuthService()