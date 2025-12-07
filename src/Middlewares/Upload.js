// Simple wrapper to handle single file field 'image'
const upload = require("../config/multer");

function uploadSingle(fieldName = "image") {
  return (req, res, next) => {
    const handler = upload.single(fieldName);
    handler(req, res, function (err) {
      if (err) {
        return next(err);
      }
      next();
    });
  };
}

module.exports = { uploadSingle };
