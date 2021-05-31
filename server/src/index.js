const express = require('express')

// Environment Variables
require('dotenv').config()

// Database
require('./db/mongodb')

// Initialization
const app = express()

// Middlewares
app.use(require('cors')())
app.use(express.json())
app.use(require('passport').initialize())
require('./middlewares/passport')

// Notification
app.get('/', (req, res) => res.send(`Started ${process.env.SERVER_NAME} server is successfuly!`))

// Routes
app.use('/auth', require('./routes/auth.router'))
app.use('/user', require('./routes/user.router'))

// Error handle
app.use((err, req, res, next) => {
  let code = 520, msg = 'Unknown error.'

  switch (err.name) {
    case 'ValidationError':
      code = 400
      msg = Object.values(err.errors).map((e, i) => (i + 1) + '. ' + e).join(', ') + '.'
      break

    case 'TokenExpiredError':
      code = 440
      msg = 'Token has expired.'
      break

    default:
      return res.status(code).send({ error: err, msg: msg })
  }

  return res.status(code).send({ msg: msg })
})

// Start server
app.listen(process.env.PORT, () => console.log(`Server started at http://localhost:${process.env.PORT || 5000}`))