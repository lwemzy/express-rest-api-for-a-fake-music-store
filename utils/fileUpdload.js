const multer = require('multer');
const GlobalErrorHandler = require('./globalErrorHandler');

// use on logged in users only
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/artist/AlbumArt');
  },
  filename: (req, file, cb) => {
    // get file extension
    const ext = file.mimetype.split('/')[1];
    cb(null, `albumArt - ${req.user.id}-${Date.now()}.${ext}`);
  }
});

// filter Images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new GlobalErrorHandler('Upload Only Images', 404), false);
};

exports.upload = multer({
  storage: multerStorage,
  limits: { fileSize: 1000000 }, // 1mb file limit
  fileFilter: multerFilter
});
