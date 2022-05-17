import API from '../apis/api'
import PU from '../apis/public'
import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}/auth/`

class AuthService {
  available = email => API.get(`${URL}${email}`)

  authenticate = user => PU.post(URL, user)

  verify = code => PR.put(URL, code)
}

export default new AuthService()