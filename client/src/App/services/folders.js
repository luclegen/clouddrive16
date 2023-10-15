import jsonAPI from '../apis/json'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/folders/`

class FoldersService {
  create = folder => jsonAPI.post(URL, folder)

  update = (id, folder) => jsonAPI.put(`${URL}${id}`, folder)

  delete = id => jsonAPI.patch(`${URL}${id}`)

  restore = id => jsonAPI.patch(`${URL}r/${id}`)

  move = (id, did) => jsonAPI.patch(`${URL}m/${id}`, did)

  copy = (id, did) => jsonAPI.patch(`${URL}c/${id}`, did)

  deleteForever = id => jsonAPI.delete(`${URL}${id}`)

  list = name => jsonAPI.get(name ? `${URL}?name=${name}` : URL)
}

export default new FoldersService()