"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _PackageRepositoryInMemory = _interopRequireDefault(require("../../../modules/packages/repositories/inMemory/PackageRepositoryInMemory"));

var _PackageDocumentRepositoryInMemory = _interopRequireDefault(require("../../../modules/packages/repositories/inMemory/PackageDocumentRepositoryInMemory"));

var _CreatePackageUseCase = _interopRequireDefault(require("../../../modules/packages/useCases/CreatePackageUseCase"));

var _PackageDocumentTypeEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageDocumentTypeEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const birthday_date = new Date(2001, 10, 5);
let accountRepositoryInMemory;
let packageRepositoryInMemory;
let packageDocumentRepositoryInMemory;
let createPackage;
describe('CreatePackageUseCase', () => {
  beforeEach(async () => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    packageRepositoryInMemory = new _PackageRepositoryInMemory.default();
    packageDocumentRepositoryInMemory = new _PackageDocumentRepositoryInMemory.default();
    createPackage = new _CreatePackageUseCase.default(packageRepositoryInMemory, packageDocumentRepositoryInMemory);
  });
  it('should be able to create a new package', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Full Name Test',
      email: 'testemail@test.com',
      phone: '5531900000000',
      password: '12345678'
    });
    const package = await createPackage.execute({
      document: {
        number: '12312312334',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      account_id: account.id
    });
    expect(package.package_document.number).toBe('12312312334');
    expect(package.package_document.type).toBe('CPF');
    expect(package.package_document.birthday_date).toBe(birthday_date);
    expect(package.account_id).toBe(account.id);
    expect(package.status).toBe('IN_ANALYSIS');
  });
  it('should not be able to create two packages with the same account id', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Full Name Test',
      email: 'testemail@test.com',
      phone: '5531900000000',
      password: '12345678'
    });
    await createPackage.execute({
      document: {
        number: '12312312334',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      account_id: account.id
    });
    await expect(createPackage.execute({
      document: {
        number: '12312312334',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      account_id: account.id
    })).rejects.toEqual(new _AppError.default('This account is already a package'));
  });
  it('should not be able to create two packages with the same document number', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Full Name Test',
      email: 'testemail@test.com',
      phone: '5531900000000',
      password: '123456789'
    });
    await createPackage.execute({
      document: {
        number: 'same-number',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      account_id: account.id
    });
    await packageDocumentRepositoryInMemory.create({
      number: 'same-number',
      type: _PackageDocumentTypeEnum.default.CPF,
      birthday_date
    });
    const account2 = await accountRepositoryInMemory.create({
      name: 'Full Name Test 2',
      email: 'testemail2@test.com',
      phone: '5531900000001',
      password: '123456789'
    });
    await expect(createPackage.execute({
      document: {
        number: 'same-number',
        type: _PackageDocumentTypeEnum.default.CPF,
        birthday_date
      },
      account_id: account2.id
    })).rejects.toEqual(new _AppError.default('This document is in use'));
  });
});