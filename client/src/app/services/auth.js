import API from '../apis/api'
import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}/auth/`

class AuthService {
  login = user => API.post(URL, user)

  available = email => API.get(`${URL}${email}`)

  verify = code => PR.put(URL, code)
}

export default new AuthService()