import API from '../apis/json'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/`

class FilesService {
  create = files => API.post(URL, files)

  read = id => API.get(`${URL}${id}`)

  update = (id, file) => API.put(`${URL}${id}`, file)

  delete = id => API.patch(`${URL}${id}`)

  restore = id => API.patch(`${URL}r/${id}`)

  move = (id, did) => API.patch(`${URL}m/${id}`, did)

  copy = (id, did) => API.patch(`${URL}c/${id}`, did)

  deleteForever = id => API.delete(`${URL}${id}`)

  list = name => API.get(name ? `${URL}?name=${name}` : URL)
}

export default new FilesService()