const fs = require('fs')
const mime = require('mime-types')
const url = require('url')
const transfer = require('../helpers/transfer')

module.exports.list = (req, res, next) => {
  const file = url.parse(req.url, true).query.path
  const dir = process.env.UPLOADS

  if (typeof file === 'undefined') {
    transfer.getImages(dir, function (err, files) {
      res.writeHead(200, { 'Content-type': 'text/html' })
      res.end()
    })
  } else {
    fs.readFile(dir + file, function (err, content) {
      if (err) {
        res.writeHead(400, { 'Content-type': 'text/html' })
        res.end('No such image')
      } else {
        res.writeHead(200, { 'Content-type': mime.lookup(file) })
        res.end(content)
      }
    })
  }
}