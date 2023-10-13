"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _fs = _interopRequireDefault(require("fs"));

var _formData = _interopRequireDefault(require("form-data"));

var _upload = _interopRequireDefault(require("../../../../../config/upload"));

var _AppError = _interopRequireDefault(require("../../../../errors/AppError"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PenToPrintProvider {
  async convertManuscript(image) {
    const data = new _formData.default();
    const originalName = (0, _path.resolve)(_upload.default.tmpFolder, image);
    data.append('srcImg', _fs.default.createReadStream(originalName));
    data.append('Session', 'string');

    try {
      const response = await _axios.default.post('https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-RapidAPI-Key': 'bbff301988msh3133a5d53d461b6p14c4e5jsn853318b95c5f',
          'X-RapidAPI-Host': 'pen-to-print-handwriting-ocr.p.rapidapi.com',
          ...data.getHeaders()
        }
      });
      console.log('Response:', response.data);
      await _fs.default.promises.unlink(originalName);
      return response.data.value;
    } catch (error) {
      throw new _AppError.default('Internal error', 500);
    }
  }

}

var _default = PenToPrintProvider;
exports.default = _default;