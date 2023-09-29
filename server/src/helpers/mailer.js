const {
  MAILER_HOST,
  MAILER_PORT,
  MAILER_USER,
  MAILER_PASS,
  MAILER_ADDR,
  COM_HOME,
  COM_NAME,
  LOGO,
  WEB1
} = require('process').env

const transport = require('nodemailer').createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  auth: { user: MAILER_USER, pass: MAILER_PASS },
  secure: false
})

module.exports.sendCode = (address, title, code) => transport.sendMail({
  from: `"${COM_NAME}" <${MAILER_ADDR}>`,
  to: address,
  subject: title,
  text: '',
  html: `<a href="${COM_HOME}" style="color: blue; text-decoration: none;">
              <h1>
                <img src="${LOGO}" alt="${COM_NAME} Logo"> ${COM_NAME}
              </h1>
            </a>
            <hr>
            <h2>` + title + '</h2>' +
            '<p>Verification code: ' + code + '</p>' +
            '<hr>' +
            '<h3>&copy; ' + new Date().getFullYear() + ` <a href="${WEB1}" style="color: blue; text-decoration: none;">Luc Huynh Tan</a><h3/>`
})
