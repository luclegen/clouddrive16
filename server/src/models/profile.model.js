const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  name: String,
  dob: {
    type: Date,
    required: 'Date of birth is required'
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: 'Gender is required'
  },
  _uid: {
    required: 'User id is required',
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

//#region Validation

profileSchema.path('dob').validate(v => (new Date()).getFullYear() - (new Date(v)).getFullYear() >= 5, 'You must be 5 years or older')

//#endregion Validation

module.exports = mongoose.model('Profile', profileSchema)