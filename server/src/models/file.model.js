const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  _uid: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User ID is required',
    ref: 'User'
  },
  path: {
    type: String,
    default: '/',
    trim: true,
    required: 'Path is required'
  },
  name: {
    type: String,
    default: 'New file',
    trim: true,
    required: 'Name is required'
  },
  is_trash: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('File', fileSchema)
