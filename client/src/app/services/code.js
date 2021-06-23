import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}code/`

class UserService {
  create = () => PR.post(URL)
}

export default new UserService()