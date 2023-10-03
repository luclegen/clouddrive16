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

    folder._uid = req.payload
    folder.path = req.body.path
    folder.name = req.body.name

    folder = await folder.save()

    if (folder) {
      ForbiddenError.from(req.ability).throwUnlessCan('create', folder)

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

module.exports.read = (req, res, next) =>
  Folder.findById(req.params.id)
    .then(folder => res.json(_.pick(folder, ['path', 'name', 'is_trash'])))
    .catch(err => next(err))

module.exports.update = (req, res, next) => req.body.name
  ? checker.isFolder(req.body.name)
    ? Folder.findById(req.params.id)
      .then(folder =>
        Folder.find({ _uid: req.payload, name: req.body.name, path: folder.path })
          .then(folders =>
            folders.length
              ? res.status(422).json('You already have a folder in the current path. Please a different name.')
              : Folder.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true })
                .then(editedFolder => editedFolder
                  ? fs.rename(
                    converter.toUploadPath(req.payload._id, folder),
                    converter.toUploadPath(req.payload._id, editedFolder),
                    err => err
                      ? next(err)
                      : Folder.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                        .then(editedFolders => editedFolders.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                          .forEach(f =>
                            (f.path = f.path?.replace(converter.toPath(folder), converter.toPath(editedFolder))) &&
                            f
                              .save()
                              .then(savedFolder => !savedFolder && res.status(404).json('Folder not found.'))
                              .catch(err => next(err))) ||
                          File.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                            .then(files => files.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                              .forEach(file => (file.path = file.path?.replace(converter.toPath(folder), converter.toPath(editedFolder))) &&
                                file.save()
                                  .then(editedFile => !editedFile && res.status(404).json('File not found.'))
                                  .catch(err => next(err))) ||
                              res.json())
                            .catch(err => next(err)))
                        .catch(err => next(err)))
                  : res.status(404).json('Folder not found.'))
                .catch(err => next(err)))
          .catch(err => next(err)))
      .catch(err => next(err))
    : res.status(400).json('Invalid folder name!')
  : res.status(403).json('Name is required.')

module.exports.delete = (req, res, next) =>
  Folder.findByIdAndUpdate(req.params.id, { $set: { is_trash: true } }, { new: true })
    .then(folder => folder ? res.status(200).json() : res.status(404).json('Folder not found.'))
    .catch(err => next(err))

module.exports.restore = (req, res, next) =>
  Folder.findByIdAndUpdate(req.params.id, { $set: { is_trash: false } }, { new: true })
    .then(folder => folder ? res.json() : res.status(404).json('Folder not found.'))
    .catch(err => next(err))

module.exports.move = (req, res, next) => Folder.findById(req.params.id)
  .then(async (folder, destFolder = undefined) =>
    (destFolder = req.body.did === 'Root' ? undefined : await Folder.findById(req.body.did)) +
    (folder
      ? (destFolder
        ? converter.toPath(folder) === converter.toPath(destFolder)
        : converter.toPath(folder) === '/')
        ? res.status(422).json('You already have a folder in the current path! Please choose another folder.')
        : Folder.find({ _uid: req.payload, name: folder.name, path: destFolder ? converter.toPath(destFolder) : '/' })
          .then(folders => folders.length
            ? res.status(422).json('You already have a folder in the current path! Please choose another folder.')
            : Folder.findByIdAndUpdate(req.params.id, { $set: { path: destFolder ? converter.toPath(destFolder) : '/' } }, { new: true })
              .then(movedFolder => movedFolder
                ? Folder.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                  .then(oldFolders => oldFolders.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                    .forEach(oldFolder =>
                      (oldFolder.path = oldFolder.path.replace(converter.toPath(folder), converter.toPath(movedFolder))) &&
                      oldFolder.save()
                        .then(movedFolder1 => !movedFolder1 && res.status(404).json('Moved folder not found!'))
                        .catch(err => next(err))) ||
                    File.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                      .then(oldFiles => oldFiles.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                        .forEach(oldFile =>
                          (oldFile.path = oldFile.path.replace(converter.toPath(folder), converter.toPath(movedFolder))) &&
                          oldFile.save()
                            .then(movedFile => !movedFile && res.status(404).json('Moved file not found!'))
                            .catch(err => next(err))) ||
                        fs.rename(
                          converter.toUploadPath(req.payload._id, folder),
                          (destFolder ? converter.toUploadPath(req.payload._id, destFolder) : process.env.UPLOADS + req.payload._id + '/files') + '/' + folder.name,
                          err => err
                            ? next(err)
                            : res.json('Done.')))
                      .catch(err => next(err)))
                  .catch(err => next(err))
                : res.status(404).json('Moved folder not found!'))
              .catch(err => next(err)))
          .catch(err => next(err))
      : res.status(404).json('Folder not found!')))
  .catch(err => next(err))

module.exports.copy = (req, res, next) => Folder.findById(req.params.id)
  .then(async (folder, destFolder = undefined) =>
    (destFolder = req.body.did === 'Root' ? undefined : await Folder.findById(req.body.did)) +
    (folder
      ? Folder.find({ _uid: req.payload, path: destFolder ? converter.toPath(destFolder) : '/' })
        .then(folders => {
          const newFolder = new Folder()

          newFolder._uid = req.payload
          newFolder.path = destFolder ? converter.toPath(destFolder) : '/'
          newFolder.name = duplicator.copyFolderInFolder(folder.name, folders.map(v => v.name))

          newFolder.save()
            .then(copiedFolder => copiedFolder
              ? Folder.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                .then(oldFolders => oldFolders.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                  .forEach(oldFolder => {
                    const newFolder1 = new Folder()

                    newFolder1._uid = req.payload
                    newFolder1.path = oldFolder.path.replace(converter.toPath(folder), converter.toPath(copiedFolder))
                    newFolder1.name = oldFolder.name

                    newFolder1.save()
                      .then(copiedFolder1 => !copiedFolder1 && res.status(404).json('Copied folder not found!'))
                      .catch(err => next(err))
                  }) ||
                  File.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                    .then(copiedFiles => copiedFiles.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                      .forEach(copiedFile => {
                        const newFile = new File()

                        newFile._uid = req.payload
                        newFile.path = copiedFile.path.replace(converter.toPath(folder), converter.toPath(copiedFolder))
                        newFile.name = copiedFile.name

                        newFile.save()
                          .then(copiedFile => !copiedFile && res.status(404).json('Copied file not found!'))
                          .catch(err => next(err))
                      }) ||
                      fse.copy(
                        converter.toUploadPath(req.payload._id, folder),
                        (destFolder ? converter.toUploadPath(req.payload._id, destFolder, folders.map(v => v.name)) : process.env.UPLOADS + req.payload._id + '/files') + '/' + duplicator.copyFolderInFolder(folder.name, folders.map(v => v.name)),
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
              ? Folder.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                .then(folders => folders.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                  .forEach(readyFolder => readyFolder.remove()
                    .then(deletedFolder => !deletedFolder && res.status(404).json('Folder isn\'t deleted.'))
                    .catch(err => next(err))) ||
                  File.find({ _uid: req.payload, path: new RegExp(`^${converter.toRegex(converter.toPath(folder))}`, 'g') })
                    .then(files => files.filter(v => converter.toPath(v).slice(0, converter.toPath(folder).length) === converter.toPath(folder))
                      .forEach(readyFile => readyFile.remove()
                        .then(deletedFile => !deletedFile && res.status(404).json.json('File isn\'t deleted.'))
                        .catch(err => next(err))) ||
                      fs.rm(
                        converter.toUploadPath(req.payload._id, folder),
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
  Folder.find({ _uid: req.payload, name: new RegExp(req.query.name, 'ig') })
    .then(folders => res.json(folders))
    .catch(err => next(err))
