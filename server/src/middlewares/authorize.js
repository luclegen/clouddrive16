const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => req.session?.token
  ? jwt.verify(req.session?.token, process.env.SECRET, (err, payload) =>
    err
      ? res
        .clearCookie('connect.sid')
        .clearCookie('id')
        .clearCookie('avatar')
        .clearCookie('firstName')
        .clearCookie('lastName')
        .clearCookie('is_activate')
        .status(401)
        .send('Login session has expired!')
      : (req.payload = payload) && next())
  : res
    .clearCookie('connect.sid')
    .clearCookie('id')
    .clearCookie('avatar')
    .clearCookie('firstName')
    .clearCookie('lastName')
    .clearCookie('is_activate')
    .sendStatus(401)