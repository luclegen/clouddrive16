const Folder = require('../models/folder.model')

module.exports.create = (req, res, next) => {
  Folder.find({ name: req.body.name, path: req.body.path })
    .then(folders => folders.length && res.status(422).send({ msg: 'You already have a folder in the current path. Please a different name.' }))
    .catch(err => next(err))

  const folder = new Folder()

  folder._userId = req._id
  folder.path = req.body.path
  folder.name = req.body.name

  folder.save()
    .then(() => res.status(201).send({ msg: 'Folder created.' }))
    .catch(err => next(err))
}
