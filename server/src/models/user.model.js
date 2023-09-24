const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checker = require('../helpers/checker')
const Lang = require('./lang.enum')

const userSchema = new mongoose.Schema({
  avatar: String,
  name: {
    first: {
      type: String,
      required: 'First name is required'
    },
    last: {
      type: String,
      required: 'Last name is required'
    }
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: 'Email is required'
  },
  password: {
    type: String,
    required: 'Password is required',
    minlength: [8, 'Password must be at least 8 characters long']
  },
  lang: {
    type: String,
    enum: {
      values: Object.values(Lang),
      message: 'Invalid language'
    },
    default: Lang.EN
  },
  is_activate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// #region Validation

userSchema.path('name.first').validate(v => checker.isFirstName(v), 'Invalid first name')
userSchema.path('name.last').validate(v => checker.isLastName(v), 'Invalid last name')
userSchema.path('email').validate(v => checker.isEmail(v), 'Invalid email')
userSchema.path('password').validate(v => checker.isStrongPassword(v), 'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters)')

// #endregion Validation

// #region Events

userSchema.pre('save', async function (next) {
  this.password && (this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10)))
  next()
})

// #endregion Events

// #region Methods

userSchema.methods.authenticate = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.sign = function () {
  return jwt.sign({ _id: this._id, username: this.username, is_activate: this.is_activate }, process.env.SECRET, this.is_activate ? {} : { expiresIn: process.env.EXP })
}

// #endregion Methods

module.exports = mongoose.model('User', userSchema)
