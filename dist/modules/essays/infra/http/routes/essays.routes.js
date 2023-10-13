"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _ensureAuthenticated = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAuthenticated"));

var _EssaySortQueryType = require("../../../types/EssaySortQueryType");

var _CreateEssayController = _interopRequireDefault(require("../controllers/CreateEssayController"));

var _FindAllEssaysByAccount = _interopRequireDefault(require("../controllers/FindAllEssaysByAccount"));

var _celebrate = require("celebrate");

var _EssayStatusEnum = _interopRequireDefault(require("../../../enums/EssayStatusEnum"));

var _ShowEssayController = _interopRequireDefault(require("../controllers/ShowEssayController"));

var _upload = _interopRequireDefault(require("../../../../../config/upload"));

var _multer = _interopRequireDefault(require("multer"));

var _CreateDraftController = _interopRequireDefault(require("../controllers/CreateDraftController"));

var _ConfirmDraftController = _interopRequireDefault(require("../controllers/ConfirmDraftController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uploadAvatar = (0, _multer.default)(_upload.default);
const essayRoutes = (0, _express.Router)();
const showEssayController = new _ShowEssayController.default();
const createEssayController = new _CreateEssayController.default();
const createDraftController = new _CreateDraftController.default();
const confirmDraftController = new _ConfirmDraftController.default();
const findAllEssaysByAccount = new _FindAllEssaysByAccount.default();
essayRoutes.use(_ensureAuthenticated.default);
essayRoutes.post('/image', uploadAvatar.single('image'), (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    theme: _celebrate.Joi.string().min(12).max(100).required()
  }
}), createDraftController.handle);
essayRoutes.put('/image/confirm/:essayId', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    theme: _celebrate.Joi.string().min(12).max(100).required(),
    text: _celebrate.Joi.string().min(1200).max(5000).required(),
    isFour: _celebrate.Joi.boolean().optional().default(false)
  },
  [_celebrate.Segments.PARAMS]: {
    essayId: _celebrate.Joi.string().uuid().required()
  }
}), confirmDraftController.handle);
essayRoutes.post('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    theme: _celebrate.Joi.string().min(12).max(100).required(),
    text: _celebrate.Joi.string().min(1200).max(5000).required(),
    isFour: _celebrate.Joi.boolean().optional().default(false)
  }
}), createEssayController.handle);
essayRoutes.get('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.QUERY]: _celebrate.Joi.object({
    sort: _celebrate.Joi.string().valid(..._EssaySortQueryType.arrayEssaySorts).optional().default('createdAt:DESC'),
    page: _celebrate.Joi.number().optional().default(1),
    size: _celebrate.Joi.number().optional().default(10),
    status: _celebrate.Joi.string().valid(...Object.values(_EssayStatusEnum.default)).optional()
  }).unknown(false)
}), findAllEssaysByAccount.handle);
essayRoutes.get('/:essayId', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    essayId: _celebrate.Joi.string().uuid().required()
  }
}), showEssayController.handle);
var _default = essayRoutes;
exports.default = _default;