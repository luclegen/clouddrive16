import PU from '../apis/public'
import PR from '../apis/private'

const URL = 'user/'

class UserService {
  create = user => PU.post(URL, user)

  read = () => PR.get(URL)
}

export default new UserService()