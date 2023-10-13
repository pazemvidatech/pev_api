"use strict";

var _PackageRepositoryInMemory = _interopRequireDefault(require("../../../modules/packages/repositories/inMemory/PackageRepositoryInMemory"));

var _FindAllPackagesUseCase = _interopRequireDefault(require("../../../modules/packages/useCases/FindAllPackagesUseCase"));

var _PackageDocumentTypeEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageDocumentTypeEnum"));

var _PackageStatusEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageStatusEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let packageRepositoryInMemory;
let findAllPackagesUseCase;
const birthday_date = new Date(2001, 10, 5);
describe('FindAllPackagesUseCase', () => {
  beforeEach(() => {
    packageRepositoryInMemory = new _PackageRepositoryInMemory.default();
    findAllPackagesUseCase = new _FindAllPackagesUseCase.default(packageRepositoryInMemory);
  });
  it('should be able to find all packages with created_at ASC', async () => {
    jest.useFakeTimers();
    const package1 = await packageRepositoryInMemory.create({
      account_id: 'account-id1',
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    setTimeout(async () => {
      const package2 = await packageRepositoryInMemory.create({
        account_id: 'account-id2',
        package_document: {
          number: '12345678912',
          type: _PackageDocumentTypeEnum.default.CPF,
          birthday_date
        },
        status: _PackageStatusEnum.default.IN_ANALYSIS
      });
      const findPackages = await findAllPackagesUseCase.execute({
        sort: 'created_at:ASC',
        page: 0,
        size: 10
      });
      expect(findPackages).toEqual({
        data: [package1, package2],
        page: 0,
        size: 10,
        total: 2
      });
    }, 1000);
  });
  it('should be able to find all packages with created_at DESC', async () => {
    jest.useFakeTimers();
    const package1 = await packageRepositoryInMemory.create({
      account_id: 'account-id1',
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    setTimeout(async () => {
      const package2 = await packageRepositoryInMemory.create({
        account_id: 'account-id2',
        package_document: {
          number: '12345678912',
          type: _PackageDocumentTypeEnum.default.CPF,
          birthday_date
        },
        status: _PackageStatusEnum.default.IN_ANALYSIS
      });
      const findPackages = await findAllPackagesUseCase.execute({
        sort: 'created_at:DESC',
        page: 0,
        size: 10
      });
      expect(findPackages).toEqual({
        data: [package2, package1],
        page: 0,
        size: 10,
        total: 2
      });
    }, 1000);
  });
  it('should be able to find all packages with different size', async () => {
    const package1 = await packageRepositoryInMemory.create({
      account_id: 'account-id1',
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    const package2 = await packageRepositoryInMemory.create({
      account_id: 'account-id2',
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    await packageRepositoryInMemory.create({
      account_id: 'account-id3',
      package_document: {
        number: '12345678912',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      status: _PackageStatusEnum.default.IN_ANALYSIS
    });
    const findPackages = await findAllPackagesUseCase.execute({
      sort: 'created_at:ASC',
      page: 0,
      size: 2
    });
    expect(findPackages).toEqual({
      data: [package1, package2],
      page: 0,
      size: 2,
      total: 2
    });
  });
});