import { inject, injectable } from 'tsyringe'

import * as XLSX from 'xlsx'
import { IShowCustomerByCodeResponseDTO } from '../dtos/IShowCustomerByCodeResponseDTO'
import IAiProvider from '@shared/container/providers/AiProvider/models/IAiProvider'
import { IConvertSpreadsheetCustomerDTO } from '../dtos/IConvertSpreadsheetCustomerDTO'
import upload from '@config/upload'
import { resolve } from 'path'

@injectable()
class ConvertSpreadsheetCustomerUseCase {
  constructor(
    @inject('AiProvider')
    private aiProvider: IAiProvider,
  ) {}

  async execute({
    file,
    cityId,
  }: IConvertSpreadsheetCustomerDTO): Promise<IShowCustomerByCodeResponseDTO> {
    const originalName = resolve(upload.tmpFolder, file)
    const workbook = XLSX.readFile(originalName)

    // Convertendo a primeira aba do arquivo para JSON
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    try {
      const customer = await this.aiProvider.convertToJson(csv, cityId)
      return customer
    } catch (error) {
      throw new error()
    }
  }
}

export default ConvertSpreadsheetCustomerUseCase
