const File = require('../models/file.model')

module.exports.create = (req, res, next) =>
  File.find({ _uid: req.payload, name: req.body.name, path: req.body.path })
    .then(files => {
      if (files.length) res.status(422).send('File is duplicate. Please choose another file.')
      else {
        JSON.parse(req.body.names).forEach(name => {
          const file = new File()

          file._uid = req.payload
          file.path = req.body.path
          file.name = name

          file.save()
            .then(() => res.status(201).send())
            .catch(err => next(err))
        })
      }
    })
    .catch(err => next(err))

module.exports.read = (req, res, next) =>
  File.find({ _uid: req._id })
    .then(files => res.status(201).send({ files: files }))
    .catch(err => next(err))
