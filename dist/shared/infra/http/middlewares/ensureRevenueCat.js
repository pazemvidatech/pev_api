"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AppError = _interopRequireDefault(require("../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ensureRevenuCat = async (req, _res, next) => {
  const {
    authorization
  } = req.headers;

  if (!authorization) {
    throw new _AppError.default('Token missing', 401);
  }

  const [, token] = authorization.split(' ');

  try {
    if (token !== process.env.REVENUCAT_TOKEN) throw new _AppError.default('Invalid token', 401);
    next();
  } catch (err) {
    throw new _AppError.default('Invalid token', 401);
  }
};

var _default = ensureRevenuCat;
exports.default = _default;