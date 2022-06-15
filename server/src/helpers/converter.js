module.exports.capitalize = text => text.length > 0 ? text[0].toUpperCase() + text.slice(1) : text

module.exports.toPath = value => value.path + (value.path === '/' ? '' : '/') + value.name

module.exports.toUploadPath = (id, value) => process.env.UPLOADS + id + '/files' + this.toPath(value)
