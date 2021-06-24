const multer = require('multer')
const fs = require("fs")

module.exports.getImages = (imgDir, callback) => {
  let files = []
  fs.readdir(imgDir, function (err, ls) {
    for (let i = 0; i < ls.length; i++) files.push(ls[i])
    callback(err, files)
  });
}

module.exports.upload = (root, dir = '', parentdir = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const path = [root];

      switch (dir) {
        case 'files':
          path.push(path[0] + req.body.path)
          break;
      }

      path.forEach(p => !fs.existsSync(p) && fs.mkdirSync(p));

      callback(null, path[path.length - 1])
    },
    filename: (req, file, callback) => callback(null, `${file.originalname}`)
  });

  return multer({ storage: storage });
}
