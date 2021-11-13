const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const getTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  )

  oauth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN })

  const accessToken = await new Promise((resolve, reject) => oauth2Client.getAccessToken((err, token) => {
    if (err) reject("Failed to create access token :( " + err)
    resolve(token)
  }))

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SERVER_EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  })

  return transporter
}

module.exports.sendCode = async (email, title, code) => {
  const options = {
    from: `"${process.env.REACT_APP_NAME}" <${process.env.SERVER_EMAIL}>`,
    to: email,
    subject: title,
    text: '',
    html: `<h1><img src="${process.env.EMAIL_LOGO}" alt="${process.env.REACT_APP_NAME} Logo"> ${process.env.REACT_APP_NAME}</h1><hr><h1>` + title + '</h1><p>Verification code: ' + code + '</p>'
  }

  try {
    (await getTransporter()).sendMail(options, (err, info) => console.log(err ? err : 'Sent email: ' + info.response))
  } catch (error) {
    return console.log(error)
  }
}