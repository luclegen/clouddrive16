const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const refuse = () => res
    .clearCookie('connect.sid')
    .clearCookie('id')
    .clearCookie('avatar')
    .clearCookie('firstName')
    .clearCookie('lastName')
    .clearCookie('is_activate')
    .sendStatus(401)

  req.session?.token
    ? jwt.verify(req.session?.token, process.env.SECRET, (err, payload) =>
      err
        ? next(err) || refuse()
        : (req.payload = payload) && next())
    : refuse()
}