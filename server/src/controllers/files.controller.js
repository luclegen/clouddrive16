const File = require('../models/file.model')

module.exports.read = (req, res, next) =>
  File.find({ _userId: req._id })
    .then(files => res.status(201).send({ files: files }))
    .catch(err => next(err))
