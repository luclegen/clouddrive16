const fs = require('fs')
const converter = require('../helpers/converter')

module.exports = async (err, req, res, next) => {
  let status = err.status || err.statusCode || 500; let msg = err.message || 'Server error!'

  if (req.app.get('env') === 'development') console.error(JSON.stringify(err))

  if (req.file && status !== 422) fs.rmSync(req.file.path)

  switch (err.name) {
  case 'ValidationError':
    status = 400
    msg = Object.values(err.errors).map((e, i) => (i + 1) + '. ' + req.t(e)).join(';\n') + '.'
    break

  case 'JsonWebTokenError':
    status = 400
    break

  case 'TokenExpiredError':
    status = 401
    break

  case 'ForbiddenError':
    status = 403
    break

  case 'AxiosError':
    status = 501
    msg = err.response?.data?.response || err.response?.data || err.message
    break

  default:
    switch (err.code) {
    case 11000:
      status = 422
      msg = converter.capitalize(Object.keys(err.keyValue)[0] + ' is taken!')
      break

    case 'ENOENT':
    case 'ENOTDIR':
    case 'ENOTEMPTY':
      status = 501
      msg = err.message
      break

    case 'ECONNREFUSED':
      status = 503
      msg = err.message
      break

    default:
      return res.status(status).json(req.t(converter.capitalize(msg)))
    }
  }

  return res.status(status).json(req.t(converter.capitalize(msg)))
}
