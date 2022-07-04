const mongoose = require('mongoose')
const { info, error } = require('console')

mongoose.connect(process.env.MONGODB)
  .then(() => info('Connected to MongoDB.'))
  .catch(err => error('Could not connect to MongoDB:', err))
