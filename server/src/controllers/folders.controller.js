const fs = require('fs')
const _ = require('lodash')
const Folder = require('../models/folder.model')

module.exports.create = (req, res, next) =>
  Folder.find({ _uid: req.payload, name: req.body.name, path: req.body.path })
    .then(folders => {
      if (folders.length) res.status(422).send('You already have a folder in the current path. Please a different name.')
      else {
        const folder = new Folder()

        folder._uid = req.payload
        folder.path = req.body.path
        folder.name = req.body.name

        folder.save()
          .then(folder => {
            const path = [process.env.UPLOADS]

            path[1] = path[0] + req.payload._id
            path[2] = path[1] + `/files`
            path[3] = path[2] + `${folder.path === '/' ? '' : folder.path}`
            path[4] = path[3] + `${'/' + folder.name}`

            path.forEach(p => !fs.existsSync(p) && fs.mkdirSync(p))

            res.status(201).send()
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))

module.exports.read = (req, res, next) =>
  Folder.findById(req.params.id)
    .then(folder => res.send(_.pick(folder, ['path', 'name', 'is_trash'])))
    .catch(err => next(err))

module.exports.update = (req, res, next) => req.body.name
  ? Folder.findById(req.params.id)
    .then(folder =>
      Folder.find({ _uid: req.payload, name: req.body.name, path: folder.path })
        .then(folders =>
          folders.length
            ? res.status(422).send('You already have a folder in the current path. Please a different name.')
            : Folder.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true })
              .then(folderEdited =>
                folderEdited
                  ? fs.rename(process.env.UPLOADS + req.payload._id + '/files' + (folder.path === '/' ? folder.path : folder.path + '/') + folder.name, process.env.UPLOADS + req.payload._id + '/files' + (folderEdited.path === '/' ? folderEdited.path : folderEdited.path + '/') + folderEdited.name, err => err) || res.send()
                  : res.status(404).send('Folder not found.'))
              .catch(err => next(err)))
        .catch(err => next(err)))
    .catch(err => next(err))
  : res.status(403).send('Name is required.')

module.exports.delete = (req, res, next) =>
  Folder.findByIdAndUpdate(req.params.id, { $set: { is_trash: true } }, { new: true })
    .then(folder => folder ? res.status(200).send() : res.status(404).send('Folder not found.'))
    .catch(err => next(err))

module.exports.restore = (req, res, next) =>
  Folder.findByIdAndUpdate(req.params.id, { $set: { is_trash: false } }, { new: true })
    .then(folder => folder ? res.send() : res.status(404).send('Folder not found.'))
    .catch(err => next(err))

module.exports.list = (req, res, next) =>
  Folder.find({ _uid: req.payload })
    .then(folders => res.send(folders))
    .catch(err => next(err))