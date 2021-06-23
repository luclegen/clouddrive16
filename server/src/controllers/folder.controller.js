const Folder = require('../models/folder.model')

module.exports.create = (req, res, next) => {
  const folder = new Folder()

  folder._userId = req._id
  if (req.body.path) folder.path = req.body.path
  if (req.body.name) folder.name = req.body.name

  folder.save()
    .then(() => res.status(201).send({ msg: 'Folder created.' }))
    .catch(err => next(err))
}
