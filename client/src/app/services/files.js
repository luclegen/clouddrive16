import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}files/`

class FilesService {
  create = files => PR.post(URL, files)

  read = () => PR.get(URL)
}

export default new FilesService()