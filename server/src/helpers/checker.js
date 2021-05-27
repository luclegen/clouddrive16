module.exports.isFirstName = v => /^[A-Z]{1}[a-z]*$/.test(v)

module.exports.isLastName = v => /^[A-Z]{1}[a-z]*(?: [A-Z]{1}[a-z]*)*(?: [A-Z]{1}[a-z]*)?$/.test(v)

module.exports.isEmail = v => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(v)

module.exports.isStrongPassword = v => v.length >= 8 && /[a-z]/ig.test(v) && /\d/g.test(v) && /[.@#$%^&*(),.?":{}|<>]/g.test(v)

module.exports.isDate = (y, m, d, date = new Date(parseInt(m) + 1 + '/' + d + '/' + y)) => date.getFullYear() === parseInt(y) && date.getMonth() === parseInt(m) && date.getDate() === parseInt(d)
