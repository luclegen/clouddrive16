import jsonAPI from '../apis/json'
import plainAPI from '../apis/plain'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/`

class FilesService {
  create = files => jsonAPI.post(URL, files)

  createPlaintext = file => jsonAPI.post(`${URL}p`, file)

  read = id => jsonAPI.get(`${URL}${id}`)

  readPlaintext = id => jsonAPI.get(`${URL}rp/${id}`)

  open = media => jsonAPI.get(media)

  update = (id, filename) => plainAPI.put(`${URL}${id}`, filename)

  savePlaintext = (id, data) => plainAPI.patch(`${URL}s/${id}`, data)

  delete = id => jsonAPI.patch(`${URL}${id}`)

  restore = id => jsonAPI.patch(`${URL}r/${id}`)

  move = (id, did) => plainAPI.patch(`${URL}m/${id}`, did)

  copy = (id, did) => plainAPI.patch(`${URL}c/${id}`, did)

  deleteForever = id => jsonAPI.delete(`${URL}${id}`)

  list = name => jsonAPI.get(name ? `${URL}?name=${name}` : URL)
}

export default new FilesService()