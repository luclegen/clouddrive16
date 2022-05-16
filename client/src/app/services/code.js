import PR from '../apis/private'

const URL = `${process.env.REACT_APP_API}code/`

class CodeService {
  create = () => PR.post(URL)
}

export default new CodeService()