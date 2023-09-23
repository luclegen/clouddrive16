const User = require('../models/user.model')
const Code = require('../models/code.model')
const _ = require('lodash')
const axios = require('axios')
const generator = require('../helpers/generator')

module.exports.create = (req, res, next) => User.findById(req.payload)
  .then(user => user
    ? Code.findOne({ _uid: req.payload })
      .then(code => {
        const body = generator.genCode(6)

        if (!code) {
          code = new Code()
          code._uid = user
        }

        code.body = body
        code.attempts = 3

        code.save()
          .then(code => code
            ? axios
              .post(process.env.MAILER, {
                email: user.email,
                title: 'Verify email',
                code: body
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${process.env.TOKEN}`
                }
              })
              .then(response => response.status === 201
                ? res.status(201).json(response.data)
                : res.status(503).json('Mailer server not started or crashed!'))
              .catch(err => next(err))
            : res.status(404).json('Code not found.'))
          .catch(err => next(err))
      })
      .catch(err => next(err))
    : res.status(404).json('User not found.'))
  .catch(err => next(err))
