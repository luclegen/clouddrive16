module.exports.genCode = length => '0'.repeat(length).split("").map(() => Math.floor(Math.random() * 10)).join("")
