"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _PackageRepositoryInMemory = _interopRequireDefault(require("../../../modules/packages/repositories/inMemory/PackageRepositoryInMemory"));

var _DeletePackageUseCase = _interopRequireDefault(require("../../../modules/packages/useCases/DeletePackageUseCase"));

var _PackageStatusEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageStatusEnum"));

var _PackageDocumentTypeEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageDocumentTypeEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let packageRepositoryInMemory;
let deletePackage;
const birthday_date = new Date(2001, 10, 5);
describe('DeletePackageUseCase', () => {
  beforeEach(() => {
    packageRepositoryInMemory = new _PackageRepositoryInMemory.default();
    deletePackage = new _DeletePackageUseCase.default(packageRepositoryInMemory);
  });
  it('should be able to delete a specific package', async () => {
    const package = await packageRepositoryInMemory.create({
      account_id: 'account-id',
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    await deletePackage.execute(package.account_id);
    const findPackage = await packageRepositoryInMemory.findByAccountId({
      account_id: package.account_id
    });
    expect(findPackage).toBe(undefined);
  });
  it('should not be able to delete a package that does not exist', async () => {
    await expect(deletePackage.execute('non-existing-id')).rejects.toEqual(new _AppError.default('This package does not exists'));
  });
});