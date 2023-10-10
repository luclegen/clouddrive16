const fs = require('fs')
const mime = require('mime-types')
const url = require('url')
const catchAsync = require('../middlewares/catcher.middleware')

module.exports.list = catchAsync(async (req, res, next) => {
  const file = url.parse(req.url, true).query.path
  const dir = `${process.env.UPLOADS}private/`

  if (typeof file === 'undefined') return res.json(fs.readdirSync(dir))

  const content = fs.readFileSync(`${dir}${file}`)

  res
    .writeHead(200, { 'Content-type': mime.lookup(file) })
    .end(content)
})
