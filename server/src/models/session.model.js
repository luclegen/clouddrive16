const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: 'ID is required'
  },
  expires: {
    type: Date,
    required: 'Expires is required'
  },
  session: {
    type: String,
    required: 'Expires is required'
  },
  _uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: 'User id is required'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Session', sessionSchema)