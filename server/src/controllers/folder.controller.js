const fs = require("fs")
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
            const path = ['uploads', 'uploads/files', `uploads/files${folder.path}/${folder.name}`]
            path.forEach(p => !fs.existsSync(p) && fs.mkdirSync(p))
            res.status(201).send({ msg: 'Folder created.' })
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))