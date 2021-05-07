const express = require('express')

// Environment Variables
require('dotenv').config()

// Initialization
const app = express()

// Middlewares
app.use(require('cors')())
app.use(express.json())
app.use(require('passport').initialize())

// Notification
app.get('/', (req, res) => res.send(`Started ${process.env.SERVER_NAME} server is successfuly!`))

// Error handle
app.use((err, req, res, next) => res.status(442).send(err.name == 'ValidationError' ? { msg: Object.values(err.errors).map((e, i) => (i + 1) + '. ' + e).join(', ') + '!' } : { error: err, msg: 'Unknown error!' }))

// Start server
app.listen(process.env.PORT, () => console.log(`Server started at http://localhost:${process.env.PORT || 5000}`))