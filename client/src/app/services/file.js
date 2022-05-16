import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}file/`

class FileService {
  create = file => PR.post(URL, file)

  read = id => PR.get(`${URL}${id}`)

  update = (id, file) => PR.put(`${URL}${id}`, file)

  delete = id => PR.patch(`${URL}${id}`)

  restore = id => PR.patch(`${URL}r/${id}`)

  deleteForever = id => PR.delete(`${URL}${id}`)
}

export default new FileService()