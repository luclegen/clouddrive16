import API from '../apis/json'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/codes/`

class CodesService {
  create = () => API.post(URL)
}

export default new CodesService()