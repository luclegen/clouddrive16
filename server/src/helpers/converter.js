const duplicator = require('./duplicator')

module.exports.capitalize = text => text.length > 0 ? text[0].toUpperCase() + text.slice(1) : text

module.exports.toPath = value => value.path + value.name + '/'

module.exports.toUploadPath = (id, value, array) => process.env.UPLOADS + id + '/files' + (array?.length ? this.toPath(value, array) : this.toPath(value))

module.exports.toFile = (filename, elements = filename.split(/\./)) => ({ name: filename.slice(0, filename.length - elements[elements.length - 1].length - 1), extension: filename.slice(filename.length - elements[elements.length - 1].length - 1) })

module.exports.toRegex = path => path.replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('[', '\\[').replaceAll(']', '\\]').replaceAll('{', '\\{').replaceAll('}', '\\}')
