const fs = require("fs")
const _ = require('lodash')
const Folder = require('../models/folder.model')

module.exports.create = (req, res, next) =>
  Folder.find({ name: req.body.name, path: req.body.path })
    .then(folders => {
      if (folders.length) res.status(422).send({ msg: 'You already have a folder in the current path. Please a different name.' })
      else {
        const folder = new Folder()

        folder._userId = req._id
        folder.path = req.body.path
        folder.name = req.body.name

        folder.save()
          .then(folder => {
            const path = [process.env.UPDATES]

            path[1] = path[0] + req._id
            path[2] = path[1] + `/files/`
            path[3] = path[2] + `${folder.path}/`
            path[4] = path[3] + `${folder.name}`
            path.forEach(p => !fs.existsSync(p) && fs.mkdirSync(p))

            res.status(201).send({ msg: 'Folder created.' })
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))

module.exports.read = (req, res, next) =>
  Folder.findById(req.params.id)
    .then(folder => res.status(200).send({ folder: _.pick(folder, ['path', 'name', 'inTrash']) }))
    .catch(err => next(err))

module.exports.update = (req, res, next) =>
  req.body.name
    ? Folder.findById(req.params.id)
      .then(folder =>
        Folder.find({ name: req.body.name, path: folder.path })
          .then(folders =>
            folders.length
              ? res.status(422).send({ msg: 'You already have a folder in the current path. Please a different name.' })
              : Folder.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true })
                .then(() => res.status(200).send({ msg: 'Folder updated.' }))
                .catch(err => next(err))
          )
          .catch(err => next(err))
      )
      .catch(err => next(err))
    : res.status(403).send({ msg: 'Name is required.' })

module.exports.delete = (req, res, next) =>
  Folder.findByIdAndUpdate(req.params.id, { $set: { inTrash: true } }, { new: true })
    .then(folder => folder ? res.status(200).send({ msg: 'Folder deleted.' }) : res.status(404).send({ msg: 'Folder not found.' }))
    .catch(err => next(err))

module.exports.restore = (req, res, next) =>
  Folder.findByIdAndUpdate(req.params.id, { $set: { inTrash: false } }, { new: true })
    .then(() => res.status(200).send({ msg: 'Folder restore.' }))
    .catch(err => next(err))

module.exports.deleteForever = (req, res, next) =>
  Folder.findById(req.params.id)
    .then(folder =>
      folder
        ? folder.inTrash
          ? Folder.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).send({ msg: 'Folder permanently deleted.' }))
            .catch(err => next(err))
          : res.status(403).send({ msg: 'Folder not in trash.' })
        : res.status(404).send({ msg: 'Folder not found.' })
    )
    .catch(err => next(err))
