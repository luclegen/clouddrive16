const { ForbiddenError } = require('@casl/ability')
const url = require('url')
const fs = require('fs')
const mime = require('mime-types')
const converter = require('../helpers/converter')
const mailer = require('../helpers/mailer')
const catchAsync = require('../middlewares/catcher.middleware')

module.exports.read = catchAsync(async (req, res, next) => {
  const filepath = url.parse(req.url, true).query.path
  const dir = `${process.env.UPLOADS}private/`
  const path = `${dir}${filepath}`
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mime.lookup(filepath),
    }

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': mime.lookup(filepath),
    }

    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})
