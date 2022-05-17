const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const refuse = () =>
    res
      .clearCookie('connect.sid')
      .clearCookie('id')
      .clearCookie('avatar')
      .clearCookie('firstName')
      .clearCookie('lastName')
      .sendStatus(401)

  if (req.session?.token) {
    try {
      const payload = await jwt.verify(req.session?.token, process.env.SECRET)

      if (payload) {
        req.payload = payload
        next()
      } else return refuse()
    } catch (err) {
      next(err)
    }
  } else return refuse()
}
