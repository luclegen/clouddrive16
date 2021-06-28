import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}folders/`

class FoldersService {
  read = () => PR.get(URL)
}

export default new FoldersService()