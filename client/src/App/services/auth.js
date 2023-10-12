import jsonAPI from '../apis/json'
import plainAPI from '../apis/plain'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/jsonAPI' : process.env.REACT_APP_API}/auth/`

class AuthService {
  login = user => jsonAPI.post(URL, user)

  available = email => jsonAPI.get(`${URL}${email}`)

  verify = code => plainAPI.put(URL, code)

  logout = () => jsonAPI.delete(URL)
}

export default new AuthService()