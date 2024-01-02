import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import { IShowCustomerByCodeResponseDTO } from '../dtos/IShowCustomerByCodeResponseDTO'
import IAiProvider from '@shared/container/providers/AiProvider/models/IAiProvider'
import { IConvertSpreadsheetCustomerDTO } from '../dtos/IConvertSpreadsheetCustomerDTO'

@injectable()
class ConvertSpreadsheetCustomerUseCase {
  constructor(
    @inject('AiProvider')
    private aiProvider: IAiProvider,
  ) {}

  async execute({
    content,
    cityId,
  }: IConvertSpreadsheetCustomerDTO): Promise<IShowCustomerByCodeResponseDTO> {
    try {
      const customer = await this.aiProvider.convertToJson(content, cityId)
      return customer
    } catch (error) {
      throw new error()
    }
  }
}

export default ConvertSpreadsheetCustomerUseCase
