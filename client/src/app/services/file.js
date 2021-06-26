import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}file/`

class FileService {
  create = file => PR.post(URL, file)

  read = id => PR.get(`${URL}/${id}`)

  update = (id, file) => PR.put(`${URL}/${id}`, file)

  delete = id => PR.patch(`${URL}/${id}`)
}

export default new FileService()