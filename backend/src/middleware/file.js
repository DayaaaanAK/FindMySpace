const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedVideoTypes = ["video/mp4", "video/quicktime"];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, "image");
  } else if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, "video");
  } else {
    cb(null, false);
  }
};

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../uploads/videos/"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter,
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter,
});

module.exports = { uploadImage, uploadVideo };
