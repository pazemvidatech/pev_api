"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CognitoProvider = _interopRequireDefault(require("../../../container/providers/AuthenticationProvider/implementations/CognitoProvider"));

var _AppError = _interopRequireDefault(require("../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ensureAdmin = async (req, _res, next) => {
  const {
    authorization
  } = req.headers;

  if (!authorization) {
    throw new _AppError.default('Token missing', 401);
  }

  const [, token] = authorization.split(' ');
  const authenticationProvider = new _CognitoProvider.default();

  try {
    const user = await authenticationProvider.verifyToken(token);
    if (!user.isAdmin) throw new _AppError.default('Invalid token', 401);
    req.account = user;
    req.accessToken = token;
    next();
  } catch (err) {
    throw new _AppError.default('Invalid token', 401);
  }
};

var _default = ensureAdmin;
exports.default = _default;