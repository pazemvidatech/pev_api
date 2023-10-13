"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ProfileAccountUseCase = _interopRequireDefault(require("../../../useCases/ProfileAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProfileAccountController {
  async handle(request, response) {
    const profileAccountUseCase = _tsyringe.container.resolve(_ProfileAccountUseCase.default);

    const profile = await profileAccountUseCase.execute(request.account);
    delete profile.terms;
    return response.json(profile);
  }

}

var _default = ProfileAccountController;
exports.default = _default;