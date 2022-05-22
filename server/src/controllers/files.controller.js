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

module.exports.list = (req, res, next) =>
  File.find({ _uid: req.payload })
    .then(files => res.status(201).send(files))
    .catch(err => next(err))
