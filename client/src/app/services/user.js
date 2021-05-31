import PU from '../api/public'

const URL = 'user/'

class UserService {
  create = user => PU.post(URL, user)
}

export default new UserService()