import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}folder/`

class UserService {
  create = folder => PR.post(URL, folder)
}

export default new UserService()