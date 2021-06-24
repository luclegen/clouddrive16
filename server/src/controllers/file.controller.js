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
          .then(() => res.status(201).send({ msg: 'File created.' }))
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))