import PR from '../apis/private'

const URL = 'code/'

class UserService {
  create = () => PR.post(URL)
}

export default new UserService()