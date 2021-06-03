const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SERVER_EMAIL,
    pass: process.env.SERVER_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

module.exports.sendCode = (email, title, code) => {
  const options = {
    from: `"${process.env.SERVER_NAME}" <${process.env.SERVER_EMAIL}>`,
    to: email,
    subject: title,
    text: '',
    html: `<h1><img src="${process.env.SERVER_LOGO}" alt="${process.env.SERVER_NAME} Logo"> ${process.env.SERVER_NAME}</h1><hr><h1>` + title + '</h1><p>Verification code: ' + code + '</p>'
  }

  transport.sendMail(options)
    .catch(err => console.warn(err))
}