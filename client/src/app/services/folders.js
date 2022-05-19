import API from '../apis/api'

const URL = `${process.env.REACT_APP_API}/folders/`

class FoldersService {
  create = folder => API.post(URL, folder)

  update = (id, folder) => API.put(`${URL}${id}`, folder)

  delete = id => API.patch(`${URL}${id}`)

  restore = id => API.patch(`${URL}r/${id}`)

  deleteForever = id => API.delete(`${URL}${id}`)

  list = () => API.get(URL)
}

export default new FoldersService()