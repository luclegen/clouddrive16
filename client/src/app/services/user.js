import PU from '../api/public'
import PR from '../api/private'

const URL = 'user/'

class UserService {
  create = user => PU.post(URL, user)

  read = () => PR.get(URL)
}

export default new UserService()