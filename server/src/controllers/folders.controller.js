const { ForbiddenError } = require('@casl/ability')
const fs = require('fs')
const _ = require('lodash')
const createError = require('http-errors')
const Folder = require('../models/folder.model')
const catchAsync = require('../middlewares/catcher.middleware')
const File = require('../models/file.model')
const converter = require('../helpers/converter')
const checker = require('../helpers/checker')
const duplicator = require('../helpers/duplicator')

module.exports.create = catchAsync(async (req, res, next) => {
  const folders = await Folder.find({ _uid: req.user, name: req.body.name, path: req.body.path }).accessibleBy(req.ability)
  if (folders.length) next(createError(422, 'You already have a directory in the current path.\nPlease change to another name.'))
  else {
    let folder = new Folder()

    folder._uid = req.user
    folder.path = req.body.path
    folder.name = req.body.name

    ForbiddenError.from(req.ability).throwUnlessCan('create', folder)

    folder = await folder.save()

    if (folder) {
      const path = [process.env.UPLOADS]

      path[1] = path[0] + 'private'
      path[2] = path[1] + `/${req.user._id}`
      path[3] = path[2] + '/files'
      path[4] = path[3] + `${folder.path === '/' ? '' : folder.path}`
      path[5] = path[4] + `/${folder.name}`

      fs.mkdirSync(path[path.length - 1], { recursive: true })

      res.status(201).json(req.t('Done'))
    } else next(createError(404, 'Folder not found.'))
  }
})

module.exports.read = catchAsync(async (req, res, next) => {
  const folder = await Folder.findById(req.params.id).accessibleBy(req.ability)

  if (folder) res.json(_.pick(folder, ['path', 'name', 'is_trash']))
  else next(createError(404, 'Folder not found.'))
})

module.exports.update = catchAsync(async (req, res, next) => {
  if (req.body) {
    if (checker.isFolder(req.body)) {
      const folder = await Folder.findById(req.params.id).accessibleBy(req.ability)

      if (folder) {
        ForbiddenError.from(req.ability).throwUnlessCan('update', folder)

        const folders = await Folder.find({ _uid: req.user, name: req.body, path: folder.path }).accessibleBy(req.ability)

        if (folders.length) return next(createError(422, 'You already have a folder in the current path.\nPlease a different name.'))
        else {
          const editedFolder = await Folder.findByIdAndUpdate(req.params.id, { $set: { name: req.body } }, { new: true }).accessibleBy(req.ability)

          if (editedFolder) {
            fs.renameSync(
              converter.toUploadPath(req.user._id, folder),
              converter.toUploadPath(req.user._id, editedFolder))

            const editedFolders = await Folder.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

            editedFolders
              .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
              .forEach(async f => {
                f.path = f.path?.replace(converter.toPath(folder), converter.toPath(editedFolder))
                const savedFolder = await f.save()

                if (!savedFolder) return next(createError(404, 'Saved Folder not found.'))
              })

            const files = await File.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

            files
              .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
              .forEach(async file => {
                file.path = file.path?.replace(converter.toPath(folder), converter.toPath(editedFolder))
                const editedFile = await file.save()

                if (!editedFile) return next(createError(404, 'File not found.'))
              })

            res.json('Updated successfully.')
          } else next(createError(404, 'Edited Folder not found.'))
        }
      } else next(createError(404, 'Folder not found.'))
    } else next(createError(400, 'Invalid folder name.'))
  } else next(createError(403, 'Name is required.'))
})

module.exports.delete = catchAsync(async (req, res, next) => {
  const folder = await Folder.findByIdAndUpdate(req.params.id, { $set: { is_trash: true } }, { new: true }).accessibleBy(req.ability)

  if (folder) {
    ForbiddenError.from(req.ability).throwUnlessCan('delete', folder)

    res.status(200).json(req.t('Deleted successfully.'))
  } else next(createError(404, 'Folder not found.'))
})

module.exports.restore = catchAsync(async (req, res, next) => {
  const folder = await Folder.findByIdAndUpdate(req.params.id, { $set: { is_trash: false } }, { new: true }).accessibleBy(req.ability)

  if (folder) {
    ForbiddenError.from(req.ability).throwUnlessCan('restore', folder)

    res.status(200).json(req.t('Restored successfully.'))
  } else next(createError(404, 'Folder not found.'))
})

module.exports.move = catchAsync(async (req, res, next) => {
  const folder = await Folder.findById(req.params.id).accessibleBy(req.ability)
  const destFolder = req.body === 'Root' ? undefined : await Folder.findById(req.body).accessibleBy(req.ability)

  if (folder) {
    ForbiddenError.from(req.ability).throwUnlessCan('move', folder)

    if (destFolder
      ? converter.toPath(folder) === converter.toPath(destFolder)
      : converter.toPath(folder) === '/') next(createError(422, 'You already have a folder in the current path!\nPlease choose another folder.'))
    else {
      const folders = await Folder.find({ _uid: req.user, name: folder.name, path: destFolder ? converter.toPath(destFolder) : '/' }).accessibleBy(req.ability)

      if (folders.length) return next(createError(422, 'You already have a folder in the current path!\nPlease choose another folder.'))

      const movedFolder = await Folder.findByIdAndUpdate(req.params.id, { $set: { path: destFolder ? converter.toPath(destFolder) : '/' } }, { new: true }).accessibleBy(req.ability)

      if (movedFolder) {
        const oldFolders = await Folder.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

        oldFolders
          .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
          .forEach(async oldFolder => {
            oldFolder.path = oldFolder.path.replace(converter.toPath(folder), converter.toPath(movedFolder))
            const movedFolder1 = await oldFolder.save()

            if (!movedFolder1) return next(createError(404, 'Moved next folder not found.'))
          })

        const oldFiles = await File.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

        oldFiles
          .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
          .forEach(async oldFile => {
            oldFile.path = oldFile.path.replace(converter.toPath(folder), converter.toPath(movedFolder))
            const movedFile = await oldFile.save()
            if (!movedFile) return next(createError(404, 'Moved file not found.'))
          })

        fs.renameSync(
          converter.toUploadPath(req.user._id, folder),
          `${(destFolder ? converter.toUploadPath(req.user._id, destFolder) : `${process.env.UPLOADS}private/${req.user._id}/files`)}/${folder.name}`)

        res.json(req.t('Moved successfully.'))
      } else next(createError(404, 'Moved folder not found.'))
    }
  } else next(createError(404, 'Folder not found.'))
})

module.exports.copy = catchAsync(async (req, res, next) => {
  const folder = await Folder.findById(req.params.id).accessibleBy(req.ability)

  if (folder) {
    ForbiddenError.from(req.ability).throwUnlessCan('copy', folder)

    const destFolder = req.body === 'Root' ? undefined : await Folder.findById(req.body)
    const folders = await Folder.find({ _uid: req.user, path: destFolder ? converter.toPath(destFolder) : '/' }).accessibleBy(req.ability)

    const newFolder = new Folder()

    newFolder._uid = req.user
    newFolder.path = destFolder ? converter.toPath(destFolder) : '/'
    newFolder.name = duplicator.copyFolderInFolder(folder.name, folders.map(v => v.name))

    const copiedFolder = await newFolder.save()

    const oldFolders = await Folder.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

    oldFolders
      .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
      .forEach(async oldFolder => {
        const newFolder1 = new Folder()

        newFolder1._uid = req.user
        newFolder1.path = oldFolder.path.replace(converter.toPath(folder), converter.toPath(copiedFolder))
        newFolder1.name = oldFolder.name

        const copiedFolder1 = await newFolder1.save()

        if (!copiedFolder1) return next(createError(404, 'Copied folder not found.'))
      })

    const copiedFiles = await File.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

    copiedFiles
      .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
      .forEach(async copiedFile => {
        const newFile = new File()

        newFile._uid = req.user
        newFile.path = copiedFile.path.replace(converter.toPath(folder), converter.toPath(copiedFolder))
        newFile.name = copiedFile.name

        copiedFile = await newFile.save()

        if (!copiedFile) return next(createError(404, 'Copied file not found.'))
      })

    fs.cpSync(
      converter.toUploadPath(req.user._id, folder),
      (destFolder ? converter.toUploadPath(req.user._id, destFolder, folders.map(v => v.name)) : `${process.env.UPLOADS}private/${req.user._id}/files`) + `/${duplicator.copyFolderInFolder(folder.name, folders.map(v => v.name))}`,
      { recursive: true })

    res.json(req.t('Copied successfully.'))
  } else next(createError(404, 'Folder not found.'))
})

module.exports.deleteForever = (req, res, next) =>
  Folder.findById(req.params.id)
    .then(folder =>
      folder
        ? folder.is_trash
          ? Folder.findByIdAndDelete(req.params.id)
            .then(folder => folder
              ? Folder.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                .then(folders => folders.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                  .forEach(readyFolder => readyFolder.remove()
                    .then(deletedFolder => !deletedFolder && res.status(404).json('Folder isn\'t deleted.'))
                    .catch(err => next(err))) ||
                  File.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                    .then(files => files.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                      .forEach(readyFile => readyFile.remove()
                        .then(deletedFile => !deletedFile && res.status(404).json.json('File isn\'t deleted.'))
                        .catch(err => next(err))) ||
                      fs.rm(
                        converter.toUploadPath(req.user._id, folder),
                        { recursive: true },
                        err => err
                          ? next(err)
                          : res.json()))
                    .catch(err => next(err)))
                .catch(err => next(err))
              : res.status(404).json('Folder not found.'))
            .catch(err => next(err))
          : res.status(403).json('Folder isn\'t trash.')
        : res.status(404).json('Folder not found.')
    )
    .catch(err => next(err))

module.exports.list = (req, res, next) =>
  Folder.find({ _uid: req.user, name: new RegExp(req.query.name, 'ig') })
    .then(folders => res.json(folders))
    .catch(err => next(err))
