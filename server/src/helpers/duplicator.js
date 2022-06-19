const converter = require('./converter')

module.exports.copyFolderInFolder = (name, array, filterArray = array.filter(v => new RegExp(`^${converter.toRegex(name)}(\\s\\(\\d\\))$`).test(v)).map(v => parseInt(v.match(/\(\d\)$/)[0].replace('(', '').replace(')', '')))) => array.includes(name) ? `${name} (${filterArray.length ? Math.max(...filterArray) + 1 : 1})` : name
