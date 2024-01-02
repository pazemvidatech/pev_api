import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ConvertSpreadsheetCustomerUseCase from '../../../useCases/ConvertSpreadsheetCustomerUseCase'

class ConvertSpreadsheetCustomerController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { content, cityId } = request.body

    const convertSpreadsheetCustomerController = container.resolve(
      ConvertSpreadsheetCustomerUseCase,
    )

    const customer = await convertSpreadsheetCustomerController.execute({
      content,
      cityId,
    })

    return response.json(customer)
  }
}

export default ConvertSpreadsheetCustomerController
