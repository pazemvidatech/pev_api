"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _ensureAuthenticated = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAuthenticated"));

var _ProfileAccountController = _interopRequireDefault(require("../controllers/ProfileAccountController"));

var _CloseAccountController = _interopRequireDefault(require("../controllers/CloseAccountController"));

var _AcceptTermsController = _interopRequireDefault(require("../controllers/AcceptTermsController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const profileAccountController = new _ProfileAccountController.default();
const closeAccountController = new _CloseAccountController.default();
const acceptTermsController = new _AcceptTermsController.default();
const accountRoutes = (0, _express.Router)();
accountRoutes.use(_ensureAuthenticated.default);
accountRoutes.get('/profile', profileAccountController.handle);
accountRoutes.post('/terms/use', acceptTermsController.handle);
accountRoutes.post('/terms/privacy', acceptTermsController.handle);
accountRoutes.delete('/', closeAccountController.handle);
var _default = accountRoutes;
exports.default = _default;