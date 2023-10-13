"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = require("crypto");

var _multer = require("multer");

var _path = require("path");

const tmpFolder = (0, _path.resolve)(__dirname, '..', '..', 'tmp');
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

var _default = {
  tmpFolder,
  limits: {
    fileSize: MAX_SIZE
  },
  storage: (0, _multer.diskStorage)({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = (0, _crypto.randomBytes)(16).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    }
  }),
  fileFilter: async (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      return cb(new Error('Only JPG and PNG files are allowed!'), false);
    }

    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }

    cb(new Error(`File upload only supports the following filetypes - ${filetypes}`));
  }
};
exports.default = _default;