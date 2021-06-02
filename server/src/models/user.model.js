const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checker = require('../helpers/checker')

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
  fullName: String,
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
  dateOfBirth: {
    type: Date,
    required: 'Date of birth is required'
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: 'Gender is required'
  },
  activated: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['root', 'admin', 'user'],
    default: 'user'
  },
}, {
  timestamps: true
})

//#region Validation

userSchema.path('name.first').validate(v => checker.isFirstName(v), 'Invalid first name')
userSchema.path('name.last').validate(v => checker.isLastName(v), 'Invalid last name')
userSchema.path('email').validate(v => checker.isEmail(v), 'Invalid email')
userSchema.path('password').validate(v => checker.isStrongPassword(v), 'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters)')
userSchema.path('dateOfBirth').validate(v => (new Date()).getFullYear() - (new Date(v)).getFullYear() >= 5, 'You must be 5 years or older')

//#endregion Validation

//#region Events

userSchema.pre('save', async function (next) {
  this.fullName = this.name.first + ' ' + this.name.last
  if (this.email == 'luc.dev.root@gmail.com') this.role = 'root'
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10))
  next()
})

//#endregion Events

//#region Methods

userSchema.methods.verified = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.getToken = function () {
  return jwt.sign({ _id: this._id, username: this.username, admin: this.role == 'root' || this.role == 'admin', activated: this.activated }, process.env.JWT_SECRET, this.activated ? {} : { expiresIn: process.env.JWT_EXP })
}

//#endregion Methods

module.exports = mongoose.model('User', userSchema)