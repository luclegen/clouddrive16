import API from '../apis/api'

const URL = `${process.env.REACT_APP_API}/users/`

class UsersService {
  create = user => API.post(URL, user)

  read = () => API.get(URL)
}

export default new UsersService()