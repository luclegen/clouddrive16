const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const checker = require('../helpers/checker')

const codeSchema = new mongoose.Schema({
  body: {
    type: String,
    trim: true,
    required: 'Content is required'
  },
  attempts: {
    type: Number,
    default: 3,
    max: 3,
    min: 0,
    required: 'Attempts is required',
  }, _uid: {
    required: 'User id is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

//#region Validation

codeSchema.path('body').validate(v => checker.isCode(v), 'Invalid body')

//#endregion Validation

//#region Events

codeSchema.pre('save', async function (next) {
  this.body = await bcrypt.hash(this.body, await bcrypt.genSalt(10))
  next()
})

//#endregion Events

//#region Methods

codeSchema.methods.verify = async function (body) {
  return await bcrypt.compare(body, this.body)
}

//#endregion Methods

module.exports = mongoose.model('Code', codeSchema)