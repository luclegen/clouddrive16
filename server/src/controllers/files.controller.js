const _ = require('lodash')
const fs = require("fs")
const File = require('../models/file.model')
const Folder = require('../models/folder.model')
const converter = require('../helpers/converter')
const duplicator = require('../helpers/duplicator')

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
    .then(file => res.download(converter.toUploadFilePath(file._uid, file)))
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
                  ? fs.rename(
                    converter.toUploadFilePath(req.payload._id, file),
                    converter.toUploadFilePath(req.payload._id, fileEdited),
                    err => err
                      ? next(err)
                      : res.send())
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

module.exports.move = (req, res, next) => File.findById(req.params.id)
  .then(async (file, destFolder = undefined) =>
    (destFolder = req.body.did === 'Root' ? undefined : await Folder.findById(req.body.did))
      + file
      ? File.find({ _uid: req.payload, name: file.name, path: destFolder ? converter.toPath(destFolder) : '/' })
        .then(files => files.length
          ? res.status(422).send('You already have a file in the current path! Please choose another file.')
          : File.findByIdAndUpdate(req.params.id, { $set: { path: destFolder ? converter.toPath(destFolder) : '/' } }, { new: true })
            .then(movedFile => movedFile
              ? fs.rename(
                converter.toUploadFilePath(req.payload._id, file),
                (destFolder ? converter.toUploadPath(req.payload._id, destFolder) : process.env.UPLOADS + req.payload._id + '/files') + '/' + file.name,
                err => err
                  ? next(err)
                  : res.send('Done.'))
              : res.status(404).send('Moved folder not found!'))
            .catch(err => next(err)))
        .catch(err => next(err))
      : res.status(404).send('Folder not found!'))
  .catch(err => next(err))

module.exports.copy = (req, res, next) => File.findById(req.params.id)
  .then(async (file, destFolder = undefined) =>
    (destFolder = req.body.did === 'Root' ? undefined : await Folder.findById(req.body.did))
      + file
      ? File.find({ _uid: req.payload, path: destFolder ? converter.toPath(destFolder) : '/' })
        .then(files => {
          const newFile = File()

          newFile._uid = req.payload
          newFile.name = duplicator.copyFileInFolder(file.name, files.map(v => v.name))
          newFile.path = destFolder ? converter.toPath(destFolder) : '/'

          newFile.save()
            .then(copiedFile => copiedFile
              ? fs.cp(
                converter.toUploadFilePath(req.payload._id, file),
                (destFolder ? converter.toUploadPath(req.payload._id, destFolder, files.map(v => v.name)) : process.env.UPLOADS + req.payload._id + '/files') + '/' + duplicator.copyFileInFolder(file.name, files.map(v => v.name)),
                err => err
                  ? next(err)
                  : res.send('Done.'))
              : res.status(404).send('File isn\'t copied!'))
        })
        .catch(err => next(err))
      : res.status(404).send('Folder not found!'))
  .catch(err => next(err))

module.exports.deleteForever = (req, res, next) =>
  File.findById(req.params.id)
    .then(file =>
      file
        ? file.is_trash
          ? File.findByIdAndDelete(req.params.id)
            .then(file =>
              file
                ? fs.rm(converter.toUploadFilePath(req.payload._id, file),
                  { recursive: true },
                  err => err
                    ? next(err)
                    : res.send())
                : res.status(404).send('File not found.'))
            .catch(err => next(err))
          : res.status(403).send('File not in trash.')
        : res.status(404).send('File not found.'))
    .catch(err => next(err))

module.exports.list = (req, res, next) =>
  File.find({ _uid: req.payload, name: new RegExp(req.query.name, 'ig') })
    .then(files => res.status(201).send(files))
    .catch(err => next(err))
