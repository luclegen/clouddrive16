const path = require('path')
const { info } = require('console')
const express = require('express')
const bodyParser = require("body-parser")

// Environment Variables
!process.env.NODE_ENV && require('dotenv').config()

// Database
require('./db/mongodb')

// Initialization
const api = express()
const web = express()
const PORT = process.env.PORT || 5000
const session = {
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {},
  store: require('connect-mongo').create({ mongoUrl: process.env.MONGODB, crypto: process.env.SECRET })
}

// Trust proxy
api.get('env') === 'production' && api.set('trust proxy', 1)

// Middlewares
api.get('env') === 'production' && web.use(express.static(path.resolve(__dirname, '../public')))
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use(require('passport').initialize())
api.use(require('express-session')(session))
api.use(require('cors')({ origin: [process.env.WEB1, process.env.WEB2], credentials: true }))
api.use(require('cookie-parser')(process.env.SECRET))
require('./middlewares/passport')

// Add routes
api.use(require('./routes'))

// Add api to web
web.use('/api', api)

// Client
api.get('env') === 'production'
  ? web.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '../public', "index.html")))
  : api.get('/', (req, res) =>
    res.send(`Started ${process.env.NAME} server is successfully!`))

// Error handle
api.use(require('./middlewares/handler'))

// Start server
web.listen(PORT, () => info(`Server started at http://localhost:${PORT}`))