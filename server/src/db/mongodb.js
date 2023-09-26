const mongoose = require('mongoose')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const { info, error } = require('console')
const { NODE_ENV } = process.env

mongoose.connect(process.env.MONGODB)
  .then(() => info(`Connected to ${NODE_ENV === 'production' ? 'Database' : 'MongoDB'}.`))
  .catch(err => error('Could not connect to MongoDB:', err))

mongoose.plugin(accessibleRecordsPlugin)
