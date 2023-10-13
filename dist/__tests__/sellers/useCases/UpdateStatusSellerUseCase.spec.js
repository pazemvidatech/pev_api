"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _PackageRepositoryInMemory = _interopRequireDefault(require("../../../modules/packages/repositories/inMemory/PackageRepositoryInMemory"));

var _UpdateStatusPackageUseCase = _interopRequireDefault(require("../../../modules/packages/useCases/UpdateStatusPackageUseCase"));

var _PackageStatusEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageStatusEnum"));

var _PackageDocumentTypeEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageDocumentTypeEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let packageRepositoryInMemory;
let updateAccountStatusPackage;
const birthday_date = new Date(2001, 10, 5);
describe('UpdateStatusPackageUseCase', () => {
  beforeEach(() => {
    packageRepositoryInMemory = new _PackageRepositoryInMemory.default();
    updateAccountStatusPackage = new _UpdateStatusPackageUseCase.default(packageRepositoryInMemory);
  });
  it('should be able to update a specific package´s account status', async () => {
    const package = await packageRepositoryInMemory.create({
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date: birthday_date
      },
      account_id: 'account-id',
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    await updateAccountStatusPackage.execute({
      new_status: _PackageStatusEnum.default.ACTIVED,
      account_id: package.account_id
    });
    expect(package.status).toBe('ACTIVED');
  });
  it('should not be able to update a package account status if not exist', async () => {
    await expect(updateAccountStatusPackage.execute({
      new_status: _PackageStatusEnum.default.ACTIVED,
      account_id: 'non-existing-id'
    })).rejects.toEqual(new _AppError.default('This package does not exists'));
  });
});