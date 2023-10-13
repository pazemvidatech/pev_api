"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AcceptTermsUseCase = _interopRequireDefault(require("../../../useCases/AcceptTermsUseCase"));

var _TermsTypeEnum = _interopRequireDefault(require("../../../enums/TermsTypeEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AcceptTermsController {
  async handle(request, response) {
    const type = request.url.includes('use') ? _TermsTypeEnum.default.USE : _TermsTypeEnum.default.PRIVACY;
    const accountId = request.account.id;

    const acceptTermsUseCase = _tsyringe.container.resolve(_AcceptTermsUseCase.default);

    const profile = await acceptTermsUseCase.execute({
      type,
      accountId
    });
    return response.json(profile);
  }

}

var _default = AcceptTermsController;
exports.default = _default;