const Code = require('../models/code.model')

module.exports.deleteCode = id =>
  Code.deleteMany({ _userId: id })
    .catch(e => next(e))
