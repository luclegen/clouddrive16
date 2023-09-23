const path = require('path')
const fs = require('fs')
const { info } = require('console')
const express = require('express')
const YAML = require("yaml")
const bodyParser = require("body-parser")
const swaggerUi = require("swagger-ui-express")

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
  : web.use(
    swaggerUi.serve,
    swaggerUi.setup(
      YAML.parse(fs.readFileSync(path.resolve(__dirname, '../configs/openapi.yaml'), 'utf8')),
    {
      explorer: true,
      customSiteTitle: 'CloudDrive16 API',
      customfavIcon: `${process.env.WEB1}/favicon.ico`,
      customCss: fs.readFileSync(path.resolve(__dirname, '../styles', 'openapi.css')).toString(),
    })
  )

// Error handle
api.use(require('./middlewares/handler'))

// Start server
web.listen(PORT, () => info(`Server started${api.get('env') === 'production' ? '' : ` at http://localhost:${PORT}`}.`))