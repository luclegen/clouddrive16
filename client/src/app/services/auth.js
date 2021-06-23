import PU from '../apis/public'
import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}auth/`

class AuthService {
  available = email => PU.get(`${URL}${email}`)

  authenticate = user => PU.post(URL, user)

  verify = code => PR.put(URL, code)
}

export default new AuthService()