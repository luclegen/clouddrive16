const fs = require('fs')
const multer = require('multer')
const converter = require('../helpers/converter')
const maxSize = 2 * 1024 * 1024

module.exports.getMediaDir = dir =>
  new Promise((resolve, reject) =>
    fs.readdir(dir, (err, files) =>
      err ? reject(err) : resolve(files)))

module.exports.upload = (dir = '', type = 'private') => multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      const path = [process.env.UPLOADS]

      switch (dir) {
      case 'companies':
        switch (file.fieldname) {
        case 'logo':
          type = 'public'
          break

        default:
          type = 'private'
          break
        }
        break

      default:
        switch (file.fieldname) {
        case 'avatar':
          type = 'public'
          break

        default:
          type = 'private'
          break
        }
        break
      }

      path[1] = path[0] + `${type}`
      path[2] = path[1] + `/${req.user._id}`
      dir && (path[3] = `${path[2]}/${dir}`)
      !!['resumes'].includes(dir) && (path[4] = `${path[3]}/id`)

      fs.mkdir(path[path.length - 1], { recursive: true }, err => err
        ? next(err)
        : next(null, path[path.length - 1]))
    },
    filename: (req, file, next) => {
      switch (dir) {
      case '':
        next(null, `${Date.now()}${converter.toFile(file.originalname).extension}`)
        break

      case 'educations':
      case 'achievements':
      case 'experiences':
      case 'certificates':
      case 'companies':
        next(null, `${Date.now()}.id${converter.toFile(file.originalname).extension}`)
        break

      case 'resumes':
        next(null, `${Date.now()}.${file.fieldname}${converter.toFile(file.originalname).extension}`)
        break

      default:
        next(null, file.originalname)
        break
      }
    }
  }),
  limits: { fileSize: maxSize }
})
