const File = require('../models/file.model')

module.exports.create = (req, res, next) =>
  File.find({ name: req.body.name, path: req.body.path })
    .then(files => {
      if (files.length) res.status(422).send({ msg: 'File is duplicate. Please choose another file.' })
      else {
        JSON.parse(req.body.names).forEach(name => {
          const file = new File()

          file._uid = req._id
          file.path = req.body.path
          file.name = name

          file.save()
            .then(() => res.status(201).send({ msg: 'File created.' }))
            .catch(err => next(err))
        })
      }
    })
    .catch(err => next(err))

module.exports.read = (req, res, next) =>
  File.find({ _uid: req._id })
    .then(files => res.status(201).send({ files: files }))
    .catch(err => next(err))
