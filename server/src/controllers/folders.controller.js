const Folder = require('../models/folder.model')

module.exports.read = (req, res, next) =>
  Folder.find({ _uid: req._id })
    .then(folders => res.status(201).send({ folders: folders }))
    .catch(err => next(err))