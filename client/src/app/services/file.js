import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}file/`

class UserService {
  create = file => PR.post(URL, file)
}

export default new UserService()