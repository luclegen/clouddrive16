const { ForbiddenError } = require('@casl/ability')
const fs = require('fs')
const fse = require('fs-extra')
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

    if (folder) ForbiddenError.from(req.ability).throwUnlessCan('create', folder)

    folder = await folder.save()

    if (folder) {
      const path = [process.env.UPLOADS]

      path[1] = path[0] + 'private'
      path[2] = path[1] + `/${req.user._id}`
      path[3] = path[2] + '/files'
      path[4] = path[3] + `${folder.path === '/' ? '' : folder.path}`
      path[5] = path[4] + `/${folder.name}`

      fs.mkdir(path[path.length - 1], { recursive: true }, err => err
        ? next(err)
        : res.status(201).json(req.t('Done')))
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
            fs.rename(
              converter.toUploadPath(req.user._id, folder),
              converter.toUploadPath(req.user._id, editedFolder),
              async err => {
                if (err) return next(err)

                const editedFolders = await Folder.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

                editedFolders
                  .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                  .forEach(async f => {
                    f.path = f.path?.replace(converter.toPath(folder), converter.toPath(editedFolder))
                    const savedFolder = await f.save()

                    if (!savedFolder) return next(createError(404, 'Saved Folder not found.'))
                  })

                try {
                  const files = await File.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') }).accessibleBy(req.ability)

                  files
                    .filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                    .forEach(async file => {
                      file.path = file.path?.replace(converter.toPath(folder), converter.toPath(editedFolder))
                      const editedFile = await file.save()

                      if (!editedFile) return next(createError(404, 'File not found.'))
                    })
                } catch (err) {
                  return next(err)
                }

                res.json('Updated successfully.')
              })
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

        fs.rename(
          converter.toUploadPath(req.user._id, folder),
          `${(destFolder ? converter.toUploadPath(req.user._id, destFolder) : `${process.env.UPLOADS}private/${req.user._id}/files`)}/${folder.name}`,
          err => err
            ? next(err)
            : res.json(req.t('Moved successfully.')))
      } else next(createError(404, 'Moved folder not found.'))
    }
  } else next(createError(404, 'Folder not found.'))
})

module.exports.copy = (req, res, next) => Folder.findById(req.params.id)
  .then(async (folder, destFolder = undefined) =>
    (destFolder = req.body.did === 'Root' ? undefined : await Folder.findById(req.body.did)) +
    (folder
      ? Folder.find({ _uid: req.user, path: destFolder ? converter.toPath(destFolder) : '/' })
        .then(folders => {
          const newFolder = new Folder()

          newFolder._uid = req.user
          newFolder.path = destFolder ? converter.toPath(destFolder) : '/'
          newFolder.name = duplicator.copyFolderInFolder(folder.name, folders.map(v => v.name))

          newFolder.save()
            .then(copiedFolder => copiedFolder
              ? Folder.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                .then(oldFolders => oldFolders.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                  .forEach(oldFolder => {
                    const newFolder1 = new Folder()

                    newFolder1._uid = req.user
                    newFolder1.path = oldFolder.path.replace(converter.toPath(folder), converter.toPath(copiedFolder))
                    newFolder1.name = oldFolder.name

                    newFolder1.save()
                      .then(copiedFolder1 => !copiedFolder1 && res.status(404).json('Copied folder not found!'))
                      .catch(err => next(err))
                  }) ||
                  File.find({ _uid: req.user, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                    .then(copiedFiles => copiedFiles.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                      .forEach(copiedFile => {
                        const newFile = new File()

                        newFile._uid = req.user
                        newFile.path = copiedFile.path.replace(converter.toPath(folder), converter.toPath(copiedFolder))
                        newFile.name = copiedFile.name

                        newFile.save()
                          .then(copiedFile => !copiedFile && res.status(404).json('Copied file not found!'))
                          .catch(err => next(err))
                      }) ||
                      fse.copy(
                        converter.toUploadPath(req.user._id, folder),
                        (destFolder ? converter.toUploadPath(req.user._id, destFolder, folders.map(v => v.name)) : process.env.UPLOADS + req.user._id + '/files') + '/' + duplicator.copyFolderInFolder(folder.name, folders.map(v => v.name)),
                        err => err
                          ? next(err)
                          : res.json('Done.')))
                    .catch(err => next(err)))
                .catch(err => next(err))
              : res.status(404).json('Copied folder not found!'))
            .catch(err => next(err))
        })
        .catch(err => next(err))
      : res.status(404).json('Folder not found!')))
  .catch(err => next(err))

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
