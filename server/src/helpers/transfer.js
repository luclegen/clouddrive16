const multer = require('multer')
const fs = require("fs")

module.exports.getImages = (dir, callback) => fs.readdir(dir, (err, files) => callback(err, files))

module.exports.upload = (root, dir = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const path = [process.env.UPLOADS];

      path[1] = path[0] + req._id

      switch (dir) {
        case 'files':
          path[2] = path[1] + '/files'
          path[3] = path[2] + req.body.path
          break;
      }

      path.forEach(p => !fs.existsSync(p) && fs.mkdirSync(p));

      callback(null, path[path.length - 1])
    },
    filename: (req, file, callback) => callback(null, `${file.originalname}`)
  });

  return multer({ storage: storage });
}
