const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const checker = require('../helpers/checker')

const codeSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User ID is required',
    ref: 'User'
  },
  content: {
    type: String,
    trim: true,
    required: 'Content is required'
  },
  times: {
    type: Number,
    default: 3,
    max: 3,
    min: 0,
    required: 'Times is required',
  },
}, {
  timestamps: true
})

//#region Validation

codeSchema.path('content').validate(v => checker.isCode(v), 'Invalid code')

//#endregion Validation

//#region Events

codeSchema.pre('save', async function (next) {
  this.content = await bcrypt.hash(this.content, await bcrypt.genSalt(10))
  next()
})

//#endregion Events

//#region Methods

codeSchema.methods.verified = function (content) {
  return bcrypt.compareSync(content, this.content)
}

//#endregion Methods

module.exports = mongoose.model('Code', codeSchema)