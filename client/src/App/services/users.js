import jsonAPI from '../apis/json'
import plainAPI from '../apis/plain'
import formDataAPI from '../apis/form-data'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/users/`

class UsersService {
  create = user => jsonAPI.post(URL, user)

  read = () => jsonAPI.get(URL)

  update = user => formDataAPI.put(URL, user)

  changeLang = lang => plainAPI.patch(URL, lang)
}

export default new UsersService()