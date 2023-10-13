"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _swagger = _interopRequireDefault(require("../../../../swagger.json"));

var _account = _interopRequireDefault(require("../../../../modules/accounts/infra/http/routes/account.routes"));

var _webhooks = _interopRequireDefault(require("../../../../modules/accounts/infra/http/routes/webhooks.routes"));

var _password = _interopRequireDefault(require("../../../../modules/accounts/infra/http/routes/password.routes"));

var _authenticate = _interopRequireDefault(require("../../../../modules/accounts/infra/http/routes/authenticate.routes"));

var _transaction = _interopRequireDefault(require("../../../../modules/transactions/infra/http/routes/transaction.routes"));

var _essays = _interopRequireDefault(require("../../../../modules/essays/infra/http/routes/essays.routes"));

var _corrections = _interopRequireDefault(require("../../../../modules/essays/infra/http/routes/corrections.routes"));

var _adminEssays = _interopRequireDefault(require("../../../../modules/essays/infra/http/routes/admin.essays.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const optionsSwagger = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pev - API Documentation'
};
const routes = (0, _express.Router)();
routes.use('/documentation', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default, optionsSwagger));
routes.use('/accounts', _account.default);
routes.use('/passwords', _password.default);
routes.use('/transactions', _transaction.default);
routes.use('/essays', _essays.default);
routes.use('/corrections', _corrections.default);
routes.use('/admin/essays', _adminEssays.default);
routes.use('/webhooks', _webhooks.default);
routes.use('/auth', _authenticate.default);
var _default = routes;
exports.default = _default;