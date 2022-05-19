import API from '../apis/api'

const URL = `${process.env.REACT_APP_API}/folders/`

class FoldersService {
  create = folder => API.post(URL, folder)

  list = () => API.get(URL)
}

export default new FoldersService()