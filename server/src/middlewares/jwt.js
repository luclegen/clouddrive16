const jwt = require('jsonwebtoken')

module.exports.verify = async (req, res, next) => {
  if ('authorization' in req.headers) {
    const token = req.headers['authorization'].split(' ')[1] === 'null' ? null : req.headers['authorization'].split(' ')[1]

    if (token) {
      try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET)

        if (payload) {
          req._id = payload._id
          next()
        } else return res.status(500).send({ msg: 'Authentication failed.' })
      } catch (err) {
        next(err)
      }
    } else return res.status(403).send({ msg: 'Login?\nYou must be logged in to do this.' })
  }
}
