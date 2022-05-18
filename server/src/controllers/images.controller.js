const fs = require('fs')
const url = require('url')
const transfer = require('../helpers/transfer')

module.exports.read = (req, res, next) => {
  const img = url.parse(req.url, true).query.image
  const dir = process.env.UPLOADS

  if (typeof img === 'undefined') {
    transfer.getImages(dir, function (err, files) {
      res.writeHead(200, { 'Content-type': 'text/html' })
      res.end()
    })
  } else {
    fs.readFile(dir + img, function (err, content) {
      if (err) {
        res.writeHead(400, { 'Content-type': 'text/html' })
        res.end('No such image')
      } else {
        res.writeHead(200, { 'Content-type': 'image' })
        res.end(content)
      }
    })
  }
}