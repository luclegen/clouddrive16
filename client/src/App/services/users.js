import API from '../apis/json'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/users/`

class UsersService {
  create = user => API.post(URL, user)

  read = () => API.get(URL)
}

export default new UsersService()