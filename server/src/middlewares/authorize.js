const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => req.session?.token
  ? jwt.verify(req.session?.token, process.env.SECRET, (err, payload) => err
    ? err.name === 'TokenExpiredError'
      ? res
        .clearCookie('connect.sid')
        .clearCookie('id')
        .clearCookie('avatar')
        .clearCookie('first_name')
        .clearCookie('last_name')
        .clearCookie('is_activate')
        .status(401)
        .send('Login session has expired!')
      : next(err)
    : req.method === 'PUT' && req.baseUrl === '/api/auth' || payload.is_activate
      ? (req.payload = payload) && next()
      : res.sendStatus(401))

  : res
    .clearCookie('connect.sid')
    .clearCookie('id')
    .clearCookie('avatar')
    .clearCookie('first_name')
    .clearCookie('last_name')
    .clearCookie('is_activate')
    .sendStatus(401)