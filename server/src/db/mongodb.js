const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)

mongoose.connect(process.env.MONGODB)

mongoose.connection.on('error', err => console.error(err))
mongoose.connection.once('open', () => console.log('Connected to MongoDB'))

require('../models/user.model')
require('../models/profile.model')
require('../models/code.model')
require('../models/folder.model')
require('../models/file.model')
