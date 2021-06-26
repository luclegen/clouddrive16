const _ = require('lodash')
const File = require('../models/file.model')

module.exports.create = (req, res, next) =>
  File.find({ name: req.body.name, path: req.body.path })
    .then(files => {
      if (files.length) res.status(422).send({ msg: 'File is duplicate. Please choose another file.' })
      else {
        const file = new File()

        file._userId = req._id
        file.path = req.body.path
        file.name = req.body.name

        file.save()
          .then(file => file ? res.status(201).send({ msg: 'File created.' }) : res.status(404).send({ msg: 'File not found.' }))
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))

module.exports.download = (req, res, next) =>
  File.findById(req.params.id)
    .then(file => res.download('uploads/' + file._userId + '/files' + file.path + '/' + file.name))
    .catch(err => next(err))

module.exports.read = (req, res, next) =>
  File.findById(req.params.id)
    .then(file => res.status(200).send({ file: _.pick(file, ['path', 'name', 'inTrash']) }))
    .catch(err => next(err))

module.exports.update = (req, res, next) =>
  req.body.name
    ? File.findById(req.params.id)
      .then(file =>
        File.find({ name: req.body.name, path: file.path })
          .then(files =>
            files.length
              ? res.status(422).send({ msg: 'You already have a file in the current path. Please a different name.' })
              : File.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true })
                .then(file => file ? res.status(200).send({ msg: 'File updated.' }) : res.status(404).send({ msg: 'File not found.' }))
                .catch(err => next(err))
          )
          .catch(err => next(err))
      )
      .catch(err => next(err))
    : res.status(403).send({ msg: 'Name is required.' })

module.exports.delete = (req, res, next) =>
  File.findByIdAndUpdate(req.params.id, { $set: { inTrash: true } }, { new: true })
    .then(file => file ? res.status(200).send({ msg: 'File deleted.' }) : res.status(404).send({ msg: 'File not found.' }))
    .catch(err => next(err))

module.exports.restore = (req, res, next) =>
  File.findByIdAndUpdate(req.params.id, { $set: { inTrash: false } }, { new: true })
    .then(file => file ? res.status(200).send({ msg: 'File restored.' }) : res.status(404).send({ msg: 'File not found.' }))
    .catch(err => next(err))

module.exports.deleteForever = (req, res, next) =>
  File.findById(req.params.id)
    .then(file =>
      file
        ? file.inTrash
          ? File.findByIdAndDelete(req.params.id)
            .then(file => file ? res.status(200).send({ msg: 'File permanently deleted.' }) : res.status(404).send({ msg: 'File not found.' }))
            .catch(err => next(err))
          : res.status(403).send({ msg: 'File not in trash.' })
        : res.status(404).send({ msg: 'File not found.' })
    )
    .catch(err => next(err))
