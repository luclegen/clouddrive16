import API from '../apis/api'

const URL = `${process.env.REACT_APP_API}/codes/`

class CodesService {
  create = () => API.post(URL)
}

export default new CodesService()