import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}files/`

class UserService {
  read = () => PR.get(URL)
}

export default new UserService()