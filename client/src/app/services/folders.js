import API from '../apis/api'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/folders/`

class FoldersService {
  create = folder => API.post(URL, folder)

  update = (id, folder) => API.put(`${URL}${id}`, folder)

  delete = id => API.patch(`${URL}${id}`)

  restore = id => API.patch(`${URL}r/${id}`)

  deleteForever = id => API.delete(`${URL}${id}`)

  list = name => API.get(name ? `${URL}?name=${name}` : URL)
}

export default new FoldersService()