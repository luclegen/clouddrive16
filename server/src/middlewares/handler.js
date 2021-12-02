module.exports = (err, req, res, next) => {
  let code = 520, msg = 'Unknown error.'

  switch (err.name) {
    case 'ValidationError':
      code = 400
      msg = Object.values(err.errors).map((e, i) => (i + 1) + '. ' + e).join(';\n') + '.'
      break

    case 'TokenExpiredError':
      code = 401
      msg = 'Login again?\nYour session has expired and must log in again.'
      break

    case 'JsonWebTokenError':
      code = 400
      msg = err.message
      break

    default:
      return res.status(code).send({ err: err, msg: msg })
  }

  return res.status(code).send({ msg: msg })
}