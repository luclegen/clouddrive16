import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}folder/`

class UserService {
  create = folder => PR.post(URL, folder)

  read = id => PR.get(`${URL}/${id}`)

  update = (id, folder) => PR.put(`${URL}/${id}`, folder)

  delete = id => PR.patch(`${URL}/${id}`)
}

export default new UserService()