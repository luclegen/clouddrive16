const Folder = require('../models/folder.model')

module.exports.create = (req, res, next) => {
  const folder = new Folder()

  folder._userId = req._id
  folder.path = req.body.path
  folder.name = req.body.name

  folder.save()
    .then(() => res.status(201).send({ msg: 'Folder created.' }))
    .catch(err => next(err))
}
