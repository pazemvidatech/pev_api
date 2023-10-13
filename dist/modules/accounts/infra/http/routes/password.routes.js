"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _celebrate = require("celebrate");

var _ResetPasswordController = _interopRequireDefault(require("../controllers/ResetPasswordController"));

var _ForgotPasswordController = _interopRequireDefault(require("../controllers/ForgotPasswordController"));

var _regex = _interopRequireDefault(require("../../../../../config/constants/regex"));

var _ChangePasswordController = _interopRequireDefault(require("../controllers/ChangePasswordController"));

var _ensureAuthenticated = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAuthenticated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passwordRoutes = (0, _express.Router)();
const resetPasswordController = new _ResetPasswordController.default();
const forgotPasswordController = new _ForgotPasswordController.default();
const changePasswordController = new _ChangePasswordController.default();
passwordRoutes.post('/reset', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    email: _celebrate.Joi.string().email().required(),
    password: _celebrate.Joi.string().trim().regex(_regex.default.password).required(),
    code: _celebrate.Joi.string().trim().regex(_regex.default.code).required()
  }
}), resetPasswordController.handle);
passwordRoutes.post('/forgot', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    email: _celebrate.Joi.string().email().required()
  }
}), forgotPasswordController.handle);
passwordRoutes.post('/change', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    oldPassword: _celebrate.Joi.string().trim().required(),
    newPassword: _celebrate.Joi.string().trim().regex(_regex.default.password).required()
  }
}), _ensureAuthenticated.default, changePasswordController.handle);
var _default = passwordRoutes;
exports.default = _default;