const multer = require('multer');
const memoryStorage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// // Init upload
// const upload = multer({
//   storage: memoryStorage,
//   // limits: { fileSize: 1000000 },
//   // fileFilter: function (req, file, cb) {
//   //   checkFileType(file, cb);
//   // }
// }).single('image');

const upload = multer({
  storage: multer.memoryStorage()
}).array('image', 10);

module.exports = upload;