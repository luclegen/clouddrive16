const _ = require('lodash')
const fs = require("fs")
const File = require('../models/file.model')

module.exports.create = (req, res, next) =>
  JSON.parse(req.body.names).forEach(name =>
    File.find({ _uid: req.payload, name: name, path: req.body.path })
      .then(files => {
        if (files.length) res.status(422).send('File is duplicate. Please choose another file.')
        else {
          const file = new File()

          file._uid = req.payload
          file.path = req.body.path
          file.name = name

          file.save()
            .then(() => res.status(201).send())
            .catch(err => next(err))
        }
      })
      .catch(err => next(err)))

module.exports.download = (req, res, next) =>
  File.findById(req.params.id)
    .then(file => res.download(process.env.UPLOADS + file._uid + '/files' + file.path + '/' + file.name))
    .catch(err => next(err))

module.exports.read = (req, res, next) =>
  File.findById(req.params.id)
    .then(file => res.send(_.pick(file, ['path', 'name', 'is_trash'])))
    .catch(err => next(err))

module.exports.update = (req, res, next) => req.body.name
  ? File.findById(req.params.id)
    .then(file =>
      File.find({ _uid: req.payload, name: req.body.name, path: file.path })
        .then(files =>
          files.length
            ? res.status(422).send('You already have a file in the current path. Please a different name.')
            : File.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true })
              .then(fileEdited =>
                fileEdited
                  ? fs.rename(process.env.UPLOADS + req.payload._id + '/files' + (file.path === '/' ? file.path : file.path + '/') + file.name, process.env.UPLOADS + req.payload._id + '/files' + (fileEdited.path === '/' ? fileEdited.path : fileEdited.path + '/') + fileEdited.name, err => err)
                  || res.send()
                  : res.status(404).send('File not found.'))
              .catch(err => next(err)))
        .catch(err => next(err)))
    .catch(err => next(err))
  : res.status(403).send('Name is required.')

module.exports.delete = (req, res, next) =>
  File.findByIdAndUpdate(req.params.id, { $set: { is_trash: true } }, { new: true })
    .then(file => file ? res.send() : res.status(404).send('File not found.'))
    .catch(err => next(err))

module.exports.restore = (req, res, next) =>
  File.findByIdAndUpdate(req.params.id, { $set: { is_trash: false } }, { new: true })
    .then(file => file ? res.send() : res.status(404).send('File not found.'))
    .catch(err => next(err))

module.exports.deleteForever = (req, res, next) =>
  File.findById(req.params.id)
    .then(file =>
      file
        ? file.is_trash
          ? File.findByIdAndDelete(req.params.id)
            .then(file =>
              file
                ? fs.rm(process.env.UPLOADS + req.payload._id + '/files' + (file.path === '/' ? file.path : file.path + '/') + file.name, { recursive: true }, err => err)
                || res.send()
                : res.status(404).send('File not found.'))
            .catch(err => next(err))
          : res.status(403).send('File not in trash.')
        : res.status(404).send('File not found.'))
    .catch(err => next(err))

module.exports.list = (req, res, next) =>
  File.find({ _uid: req.payload })
    .then(files => res.status(201).send(files))
    .catch(err => next(err))
