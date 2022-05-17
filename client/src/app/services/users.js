import API from '../apis/api'
import PU from '../apis/public'
import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}/users/`

class UserService {
  create = user => API.post(URL, user)

  read = () => PR.get(URL)
}

export default new UserService()