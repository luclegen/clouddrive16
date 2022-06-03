const path = require('path')
const { info } = require('console')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')

// Environment Variables
!process.env.NODE_ENV && require('dotenv').config()

// Database
require('./db/mongodb')

// Initialization
const api = express()
const web = express()
const PORT = process.env.PORT || 5000
const sess = {
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {},
  store: MongoStore.create({ mongoUrl: process.env.MONGODB, crypto: process.env.SECRET })
}

// Trust proxy
api.get('env') === 'production' && api.set('trust proxy', 1)

// Middlewares
if (process.env.NODE_ENV == 'production') web.use(express.static(path.resolve(__dirname, './views')))
api.use(express.json())
api.use(require('passport').initialize())
api.use(session(sess))
api.use(require('cors')({ origin: [process.env.WEB1, process.env.WEB2], credentials: true }))
api.use(require('cookie-parser')(process.env.SECRET))
require('./middlewares/passport')

// Routes
api.use('/auth', require('./routes/auth.router'))
api.use('/users', require('./routes/users.router'))
api.use('/codes', require('./routes/codes.router'))
api.use('/folders', require('./routes/folders.router'))
api.use('/files', require('./routes/files.router'))
api.use('/images', require('./routes/images.router'))

// Client
if (process.env.NODE_ENV == 'production')
  web.get(['/find-account'], (req, res) => res.sendFile(path.join(__dirname, './views', "index.html")))
else
  api.get('/', (req, res) => res.send(`Started ${process.env.NAME} server is successfully!`))

// Error handle
api.use(require('./middlewares/handler'))

// Add api to web
web.use('/api', api)

// Start server
web.listen(PORT, () => info(`Server started at http://localhost:${PORT}`))