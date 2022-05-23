import API from '../apis/api'

const URL = `${process.env.REACT_APP_API}/files/`

class FilesService {
  create = files => API.post(URL, files)

  read = id => API.get(`${URL}${id}`)

  update = (id, file) => API.put(`${URL}${id}`, file)

  delete = id => API.patch(`${URL}${id}`)

  list = () => API.get(URL)
}

export default new FilesService()