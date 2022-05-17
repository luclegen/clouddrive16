const converter = require('../helpers/converter')

module.exports = (err, req, res, next) => {
  let code = 500, msg = 'Server error!'

  if (err.code === 11000)
    return res.status(422).send(converter.capitalize(Object.keys(err.keyValue)[0] + ' is taken!'))

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
      break

    default:
      return res.status(code).send(Object.entries(err).length ? err : converter.capitalize(msg))
  }

  return res.status(code).send(converter.capitalize(msg))
}