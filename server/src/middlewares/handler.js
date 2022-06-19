const converter = require('../helpers/converter')

module.exports = (err, req, res, next) => {
  let code = 500, msg = 'Server error!'

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
      code = 401
      msg = err.message
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
          return res.status(code).send(Object.entries(err).length ? err : converter.capitalize(msg))
      }
  }

  return res.status(code).send(converter.capitalize(msg))
}