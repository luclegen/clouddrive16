const multer = require('multer');
const fs = require("fs");

module.exports.getImages = (imgDir, callback) => {
  let files = [];
  fs.readdir(imgDir, function (err, ls) {
    for (let i = 0; i < ls.length; i++) files.push(ls[i]);
    callback(err, files);
  });
}

module.exports.upload = (root, dir = '', parentdir = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const path = [];

      path.push(root + '/' + (req.params.id ? req.params.id : ''));
      if (dir) path.push(path[0] + '/' + (parentdir ? parentdir : dir));

      switch (dir) {
        case 'files':
          path.push(path[1] + '/' + JSON.parse(req.body.slideshow).color.replace(/#/, ''));
          break;
      }

      path.forEach(p => { if (!fs.existsSync(p)) fs.mkdirSync(p); });

      callback(null, path[path.length - 1]);
    },
    filename: (req, file, callback) => {
      callback(null, `${file.originalname}`);
    }
  });

  return multer({ storage: storage });
}
