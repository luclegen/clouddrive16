import API from '../apis/api'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/auth/`

class AuthService {
  login = user => API.post(URL, user)

  available = email => API.get(`${URL}${email}`)

  verify = code => API.put(URL, code)

  logout = () => API.delete(URL)
}

export default new AuthService()