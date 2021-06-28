import PR from '../apis/private'

const URL = `${process.env.REACT_APP_SERVER_URL}code/`

class CodeService {
  create = () => PR.post(URL)
}

export default new CodeService()