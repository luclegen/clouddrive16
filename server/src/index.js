const path = require('path')
const fs = require('fs')
const { info } = require('console')
const express = require('express')
const YAML = require('yaml')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')

// Environment Variables
!process.env.NODE_ENV && require('dotenv').config()

// Databases
require('./databases/mongodb')

// Initialization
const api = express()
const web = express()
const PORT = process.env.PORT || 5000
const session = {
  name: 'session',
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {},
  store: require('connect-mongo').create({ mongoUrl: process.env.MONGODB, crypto: process.env.SECRET })
}

// Trust proxy
api.get('env') === 'production' && api.set('trust proxy', 1)

// Middlewares
api.get('env') === 'production' && web.use(serveStatic(path.resolve(__dirname, '../public')))
api
  .use(cookieParser())
  .use(bodyParser.text())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(require('compression')())
  .use(require('connect-timeout')('10s'))
  .use(require('response-time')((req, res, time) => info(req.method, req.baseUrl, `${time}ms`)))
  .use(require('passport').initialize())
  .use(require('express-session')(session))
  .use(require('cors')({ origin: [process.env.WEB1, process.env.WEB2], credentials: true }))
  .use(require('cookie-parser')(process.env.SECRET))
  .use(require('./middlewares/authentication.middleware'))
  .use(require('./middlewares/translator.middleware'))
  .use(require('./middlewares/logger.middleware'))

// Add routes
api.use(require('./routes'))

// Add api to web
web.use('/api', api)

// Client
api.get('env') === 'production'
  ? web.get('*', (req, res) =>
    res.jsonFile(path.join(__dirname, '../public', 'index.html')))
  : web.use(
    swaggerUi.serve,
    swaggerUi.setup(
      YAML.parse(fs.readFileSync(path.resolve(__dirname, './configs', 'openapi.yaml'), 'utf8')),
      {
        explorer: true,
        customSiteTitle: 'CloudDrive16 API',
        customfavIcon: `${process.env.WEB1}/favicon.ico`,
        customCss: fs.readFileSync(path.resolve(__dirname, './styles', 'openapi.css')).toString()
      })
  )

// Error handle
api.use(require('./middlewares/handler.middleware'))

// Start server
web.listen(PORT, () => info(`Server started${api.get('env') === 'production' ? '' : ` at http://localhost:${PORT}`}.`))
