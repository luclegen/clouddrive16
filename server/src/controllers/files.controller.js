const { ForbiddenError } = require('@casl/ability')
const fs = require('fs')
const createError = require('http-errors')
const File = require('../models/file.model')
const Folder = require('../models/folder.model')
const catchAsync = require('../middlewares/catcher.middleware')
const checker = require('../helpers/checker')
const converter = require('../helpers/converter')
const duplicator = require('../helpers/duplicator')

module.exports.create = catchAsync(async (req, res, next) => {
  if (!req.body.name) return next(createError(400, 'Name is required.'))

  const files = await File.find({ _uid: req.user, name: req.body.name, path: req.body.path }).accessibleBy(req.ability)

  if (files.length) return next(createError(422, 'File is duplicate.\nPlease choose another file.'))

  let file = new File()

  file._uid = req.user
  file.path = req.body.path
  file.name = req.body.name

  ForbiddenError.from(req.ability).throwUnlessCan('create', file)

  file = await file.save()

  if (!file) return next(createError(404, 'File not found.'))

  res.status(201).json(req.t('Uploaded successfully.'))
})

module.exports.createPlaintext = catchAsync(async (req, res, next) => {
  if (!req.body.name) return next(createError(400, 'Name is required.'))
  if (!checker.isPlaintext(req.body.name)) return next(createError(400, 'Invalid plain text document file name.'))

  const files = await File.find({ _uid: req.user, name: req.body.name, path: req.body.path }).accessibleBy(req.ability)

  if (files.length) return next(createError(422, 'File is duplicate.\nPlease choose another file.'))

  let file = new File()

  file._uid = req.user
  file.path = req.body.path
  file.name = req.body.name

  ForbiddenError.from(req.ability).throwUnlessCan('create', file)

  file = await file.save()

  if (!file) return next(createError(404, 'File not found.'))

  fs.openSync(`${converter.toUploadFilePath(req.user._id, { path: req.body.path, name: req.body.name })}`, 'w')

  res.status(201).json(req.t('Created successfully.'))
})

module.exports.download = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id).accessibleBy(req.ability)

  if (!file) return next(createError(404, 'File not found.'))

  ForbiddenError.from(req.ability).throwUnlessCan('download', file)

  res.download(converter.toUploadFilePath(file._uid, file))
})

module.exports.read = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id).accessibleBy(req.ability)

  if (!file) return next(createError(404, 'File not found.'))

  res.json(file)
})

module.exports.update = catchAsync(async (req, res, next) => {
  if (!req.body) return next(createError(400, 'Name is required.'))

  const file = await File.findById(req.params.id).accessibleBy(req.ability)

  if (!file) return next(createError(404, 'File not found.'))

  const files = await File.find({ _uid: req.user, name: req.body, path: file.path }).accessibleBy(req.ability)

  if (files.length) return next(createError(422, 'You already have a file in the current path.\nPlease a different name.'))

  const fileEdited = await File.findByIdAndUpdate(req.params.id, { $set: { name: req.body } }, { new: true }).accessibleBy(req.ability, 'update')

  if (!fileEdited) return next(createError(404, 'Edited file not found.'))

  fs.renameSync(
    converter.toUploadFilePath(req.user._id, file),
    converter.toUploadFilePath(req.user._id, fileEdited))

  res.json(req.t('Updated successfully.'))
})

module.exports.delete = catchAsync(async (req, res, next) => {
  const file = await File.findByIdAndUpdate(req.params.id, { $set: { is_trash: true } }, { new: true }).accessibleBy(req.ability, 'delete')

  if (!file) return next(createError(404, 'File not found.'))

  res.json(req.t('Deleted successfully.'))
})

module.exports.restore = catchAsync(async (req, res, next) => {
  const file = await File.findByIdAndUpdate(req.params.id, { $set: { is_trash: false } }, { new: true }).accessibleBy(req.ability, 'restore')

  if (!file) return next(createError(404, 'File not found.'))

  res.json(req.t('restored successfully.'))
})

module.exports.move = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id).accessibleBy(req.ability)

  if (!file) return next(createError(404, 'Folder not found.'))

  const destFolder = req.body === 'Root' ? undefined : await Folder.findById(req.body).accessibleBy(req.ability)

  const files = await File.find({ _uid: req.user, name: file.name, path: destFolder ? converter.toPath(destFolder) : '/' }).accessibleBy(req.ability)

  if (files.length) return next(createError(422, 'You already have a file in the current path.\nPlease choose another file.'))

  const movedFile = await File.findByIdAndUpdate(req.params.id, { $set: { path: destFolder ? converter.toPath(destFolder) : '/' } }, { new: true }).accessibleBy(req.ability, 'move')

  if (!movedFile) return next(createError(404, 'Moved file not found.'))

  fs.renameSync(
    converter.toUploadFilePath(req.user._id, file),
    (destFolder ? converter.toUploadPath(req.user._id, destFolder) : `${process.env.UPLOADS}private/${req.user._id}/files`) + `/${file.name}`)

  res.json(req.t('Moved successfully.'))
})

module.exports.copy = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id).accessibleBy(req.ability)

  if (!file) return next(createError(404, 'File not found.'))

  const destFolder = req.body === 'Root' ? undefined : await Folder.findById(req.body).accessibleBy(req.ability)

  const files = await File.find({ _uid: req.user, path: destFolder ? converter.toPath(destFolder) : '/' }).accessibleBy(req.ability)

  const newFile = File()

  newFile._uid = req.user
  newFile.name = duplicator.copyFileInFolder(file.name, files.map(v => v.name))
  newFile.path = destFolder ? converter.toPath(destFolder) : '/'

  ForbiddenError.from(req.ability).throwUnlessCan('copy', newFile)

  const copiedFile = await newFile.save()

  if (!copiedFile) return next(createError(404, 'Copied file not found.'))

  fs.cpSync(
    converter.toUploadFilePath(req.user._id, file),
    (destFolder ? converter.toUploadPath(req.user._id, destFolder, files.map(v => v.name)) : `${process.env.UPLOADS}private${req.user._id}/files`) + `/${duplicator.copyFileInFolder(file.name, files.map(v => v.name))}`)

  res.json(req.t('Copied successfully.'))
})

module.exports.deleteForever = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id).accessibleBy(req.ability)

  if (!file) return next(createError(404, 'File not found.'))
  if (!file.is_trash) return next(createError(403, 'File not in trash.'))

  const fileDeleted = await File.findByIdAndDelete(req.params.id).accessibleBy(req.ability, 'deleteForever')

  if (!fileDeleted) return next(createError(404, 'Deleted file not found.'))

  fs.rmSync(converter.toUploadFilePath(req.user._id, file), { recursive: true })

  res.json(req.t('Deleted forever successfully.'))
})

module.exports.list = catchAsync(async (req, res, next) => {
  const files = await File.find({ _uid: req.user, name: new RegExp(req.query.name, 'ig') }).accessibleBy(req.ability, 'list')

  res.json(files)
})
