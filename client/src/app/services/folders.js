import API from '../apis/api'
import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}/folders/`

class FoldersService {
  create = folder => API.post(URL, folder)

  read = () => PR.get(URL)
}

export default new FoldersService()