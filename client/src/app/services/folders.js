import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}folders/`

class FoldersService {
  read = () => PR.get(URL)
}

export default new FoldersService()