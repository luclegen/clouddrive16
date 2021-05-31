import PU from '../api/public'

const URL = 'auth/'

class AuthService {
  checkEmail = email => PU.get(`${URL}${email}`)

  authenticate = user => PU.post(`${URL}/`, user)
}

export default new AuthService()