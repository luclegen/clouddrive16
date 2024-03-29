const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checker = require('../helpers/checker')
const Lang = require('./lang.enum')
const roles = require('./roles.json')

const userSchema = new mongoose.Schema({
  avatar: String,
  name: {
    first: {
      type: String,
      required: 'First name is required'
    },
    middle: {
      type: String
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
    minlength: [8, 'Password must be at least 8 characters long.']
  },
  roles: [{
    type: String,
    enum: {
      values: Object.keys(roles),
      message: 'Invalid role'
    },
    default: Object.keys(roles)[0]
  }],
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

userSchema.path('email').validate(v => checker.isEmail(v), 'Invalid email')
userSchema.path('password').validate(v => checker.isStrongPassword(v), 'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).')

// #endregion Validation

// #region Methods

userSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.sign = function () {
  return jwt.sign({ _id: this._id, roles: this.roles, username: this.username, is_activate: this.is_activate }, process.env.SECRET, this.is_activate ? {} : { expiresIn: process.env.EXP })
}

// #endregion Methods

module.exports = mongoose.model('User', userSchema)
