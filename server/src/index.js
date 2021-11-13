const path = require('path')
const express = require('express')

// Environment Variables
require('dotenv').config()

// Database
require('./db/mongodb')

// Initialization
const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
if (process.env.NODE_ENV == 'production') app.use(express.static(path.resolve(__dirname, '../client')))
app.use(require('cors')())
app.use(express.json())
app.use(require('passport').initialize())
require('./middlewares/passport')

// Routes
app.use('/auth', require('./routes/auth.router'))
app.use('/user', require('./routes/user.router'))
app.use('/code', require('./routes/code.router'))
app.use('/folder', require('./routes/folder.router'))
app.use('/folders', require('./routes/folders.router'))
app.use('/file', require('./routes/file.router'))
app.use('/files', require('./routes/files.router'))
app.use('/images', require('./routes/images.router'))

// Client
if (process.env.NODE_ENV == 'production')
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client', 'index.html')))
else
  app.get('/', (req, res) => res.send(`Started ${process.env.APP_NAME} server is successfully!`))

// Error handle
app.use(require('./middlewares/handler'))

// Start server
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))