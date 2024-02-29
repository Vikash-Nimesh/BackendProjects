const multer = require('multer')

const fileUploader = (req, res, next) => {
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, 'images')
      },
      filename: function (req, file, callback) {
        callback(null, file.originalname)
      }
    })
  }).single('file')
  next()
}

module.exports = fileUploader
