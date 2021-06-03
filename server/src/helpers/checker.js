module.exports.isFirstName = value => /^[A-Z]{1}[a-z]*$/.test(value)

module.exports.isLastName = value => /^[A-Z]{1}[a-z]*(?: [A-Z]{1}[a-z]*)*(?: [A-Z]{1}[a-z]*)?$/.test(value)

module.exports.isEmail = value => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)

module.exports.isStrongPassword = value => value.length >= 8 && /[a-z]/ig.test(value) && /\d/g.test(value) && /[.@#$%^&*(),.?":{}|<>]/g.test(value)

module.exports.isDate = (year, month, day, date = new Date(parseInt(month) + 1 + '/' + day + '/' + year)) => date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(month) && date.getDate() === parseInt(day)

module.exports.isCode = value => /^\d{6}$/.test(value)
