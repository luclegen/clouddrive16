const converter = require('../helpers/converter')

module.exports = (err, req, res, next) => {
  let code = err.status || 500; let msg = err.message || 'Server error!'

  switch (err.name) {
  case 'ValidationError':
    code = 400
    msg = Object.values(err.errors).map((e, i) => (i + 1) + '. ' + e).join(';\n') + '.'
    break

  case 'JsonWebTokenError':
    code = 400
    msg = err.message
    break

  case 'TokenExpiredError':
    code = 401
    msg = err.message
    break

  case 'AxiosError':
    code = 501
    msg = err.response?.data?.response || err.response?.data || err.message
    break

  default:
    switch (err.code) {
    case 11000:
      code = 422
      msg = converter.capitalize(Object.keys(err.keyValue)[0] + ' is taken!')
      break

    case 'ENOENT':
    case 'ENOTDIR':
    case 'ENOTEMPTY':
      code = 501
      msg = err.message
      break

    case 'ECONNREFUSED':
      code = 503
      msg = err.message
      break

    default:
      return res.status(code).json(Object.entries(err).length ? err : converter.capitalize(msg))
    }
  }

  return res.status(code).json(converter.capitalize(msg))
}
