import PU from '../apis/public'
import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}user/`

class UserService {
  create = user => PU.post(URL, user)

  read = () => PR.get(URL)
}

export default new UserService()