const User = require('../models/user.model')
const Code = require('../models/code.model')
const _ = require('lodash')
const Client = require('node-rest-client').Client
const generator = require('../helpers/generator')

module.exports.create = (req, res, next) => User.findById(req.payload)
  .then(user => Code.findOne({ _uid: req.payload })
    .then(code => {
      const body = generator.genCode(6)

      if (!code) {
        code = new Code()
        code._uid = user
      }

      code.body = body

      code.save()
        .then(code => {
          if (user) {
            if (code) {
              const args = {
                data: {
                  email: user.email,
                  title: 'Verify email',
                  code: body
                },
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${process.env.TOKEN}`
                }
              }
              const client = new Client()

              client.post(process.env.MAILER, args, (data, response) =>
                response.statusCode === 201
                  ? res.status(201).send(data.toString(process.env.PLAIN))
                  : res.stats(503).send('Mailer server not started or crashed!'))
            } else res.status(404).send({ msg: 'Code not found.' })
          } else res.status(404).send({ msg: 'User not found.' })
        })
        .catch(err => next(err))
    }))
  .catch(err => next(err))
