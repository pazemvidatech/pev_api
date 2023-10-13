"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _ensureAuthenticated = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAuthenticated"));

var _EssaySortQueryType = require("../../../types/EssaySortQueryType");

var _ensureAdmin = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAdmin"));

var _DeleteEssayController = _interopRequireDefault(require("../controllers/DeleteEssayController"));

var _FindAllEssaysController = _interopRequireDefault(require("../controllers/FindAllEssaysController"));

var _UpdateStatusEssayController = _interopRequireDefault(require("../controllers/UpdateStatusEssayController"));

var _celebrate = require("celebrate");

var _EssayStatusEnum = _interopRequireDefault(require("../../../enums/EssayStatusEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const essayRoutes = (0, _express.Router)();
const deleteEssayController = new _DeleteEssayController.default();
const findAllEssaysController = new _FindAllEssaysController.default();
const updateStatusEssayController = new _UpdateStatusEssayController.default();
essayRoutes.use(_ensureAuthenticated.default);
essayRoutes.use(_ensureAdmin.default);
essayRoutes.get('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.QUERY]: {
    sort: _celebrate.Joi.string().valid(..._EssaySortQueryType.arrayEssaySorts).optional().default('createdAt:DESC'),
    page: _celebrate.Joi.number().optional().default(1),
    size: _celebrate.Joi.number().optional().default(10),
    status: _celebrate.Joi.string().valid(...Object.values(_EssayStatusEnum.default)).optional(),
    accountId: _celebrate.Joi.string().uuid().optional()
  }
}), findAllEssaysController.handle);
essayRoutes.patch('/:essayId/status', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    essayId: _celebrate.Joi.string().uuid().required()
  },
  [_celebrate.Segments.BODY]: {
    newStatus: _celebrate.Joi.string().valid(...Object.values(_EssayStatusEnum.default)).required()
  }
}), updateStatusEssayController.handle);
essayRoutes.delete('/:essayId', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    essaId: _celebrate.Joi.string().uuid().required()
  }
}), deleteEssayController.handle);
var _default = essayRoutes;
exports.default = _default;