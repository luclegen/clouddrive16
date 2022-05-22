import API from '../apis/api'

const URL = `${process.env.REACT_APP_API}/files/`

class FilesService {
  create = files => API.post(URL, files)

  list = () => API.get(URL)
}

export default new FilesService()