const fs = require('fs')
const morgan = require('morgan')

fs.existsSync('logs') || fs.mkdirSync('logs', { recursive: true })

module.exports = morgan('combined', { stream: fs.createWriteStream(require('path').resolve('logs', `${process.env.NODE_ENV}.log`), { flags: 'a' }) })
