const Code = require('../models/code.model')

module.exports.deleteCode = id =>
  Code.deleteMany({ _uid: id })
    .catch(e => next(e))
