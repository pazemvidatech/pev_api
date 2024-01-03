import { Request, Response } from 'express'
import { container } from 'tsyringe'
import FileType from 'file-type'
import fs from 'fs'
import ConvertSpreadsheetCustomerUseCase from '../../../useCases/ConvertSpreadsheetCustomerUseCase'
import AppError from '@shared/errors/AppError'

class ConvertSpreadsheetCustomerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { cityId } = req.body
    const file = req.file.filename

    if (!req.file) {
      return res.status(422).send('Nenhum arquivo foi recebido')
    }

    const type = await FileType.fromFile(req.file.path)

    console.log(type)
    console.log(type.ext)

    if (!type || !['xls', 'xlsx', 'cfb'].includes(type.ext)) {
      await fs.promises.unlink(req.file.path)
      throw new AppError('Tipo de arquivo inválido', 422)
    }

    const convertSpreadsheetCustomerController = container.resolve(
      ConvertSpreadsheetCustomerUseCase,
    )

    const customer = await convertSpreadsheetCustomerController.execute({
      file,
      cityId,
    })

    return res.json(customer)
  }
}

export default ConvertSpreadsheetCustomerController
