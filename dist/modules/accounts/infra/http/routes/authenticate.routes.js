"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _SignInController = _interopRequireDefault(require("../../http/controllers/SignInController"));

var _SignUpController = _interopRequireDefault(require("../../http/controllers/SignUpController"));

var _ConfirmSignUpController = _interopRequireDefault(require("../../http/controllers/ConfirmSignUpController"));

var _RefreshTokenController = _interopRequireDefault(require("../../http/controllers/RefreshTokenController"));

var _celebrate = require("celebrate");

var _regex = _interopRequireDefault(require("../../../../../config/constants/regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const authenticateRoutes = (0, _express.Router)();
const signInController = new _SignInController.default();
const signUpController = new _SignUpController.default();
const confirmSignUpController = new _ConfirmSignUpController.default();
const refreshTokenController = new _RefreshTokenController.default();
authenticateRoutes.post('/signup', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    name: _celebrate.Joi.string().trim().regex(_regex.default.name).required(),
    email: _celebrate.Joi.string().trim().email().required(),
    password: _celebrate.Joi.string().trim().regex(_regex.default.password).required()
  }
}), signUpController.handle);
authenticateRoutes.post('/signin', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    email: _celebrate.Joi.string().email().required(),
    password: _celebrate.Joi.string().trim().required(),
    fmToken: _celebrate.Joi.string().trim().optional()
  }
}), signInController.handle);
authenticateRoutes.post('/refresh-token', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    refreshToken: _celebrate.Joi.string().required(),
    fmToken: _celebrate.Joi.string().trim().optional()
  }
}), refreshTokenController.handle);
authenticateRoutes.post('/confirm-signup', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    email: _celebrate.Joi.string().trim().email().required(),
    code: _celebrate.Joi.string().trim().regex(_regex.default.code).required()
  }
}), confirmSignUpController.handle);
var _default = authenticateRoutes;
exports.default = _default;