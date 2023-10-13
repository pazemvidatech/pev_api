"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _ensureAdmin = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAdmin"));

var _CreateCorrectionController = _interopRequireDefault(require("../controllers/CreateCorrectionController"));

var _celebrate = require("celebrate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const correctionsRoutes = (0, _express.Router)();
const createCorrectionController = new _CreateCorrectionController.default();
correctionsRoutes.use(_ensureAdmin.default);
correctionsRoutes.post('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    essayId: _celebrate.Joi.string().uuid().required()
  }
}), createCorrectionController.handle);
var _default = correctionsRoutes;
exports.default = _default;