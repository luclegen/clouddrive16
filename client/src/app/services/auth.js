import axios from 'axios'

class AuthService {
  checkEmail = email => axios.post('auth/check-email', { email: email })

  register = user => axios.post('auth/register', user)

  authenticate = user => axios.post('auth/authenticate', user)
}

export default new AuthService()