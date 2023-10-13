import { Request, Response } from 'express'
import { container } from 'tsyringe'
import FileType from 'file-type'
import fs from 'fs'

import CreateDraftUseCase from '../../../useCases/CreateDraftUseCase'

class CreateDraftController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { theme } = req.body
    const { id } = req.account
    const image = req.file.filename

    if (!req.file) {
      return res.status(422).send('Nenhum arquivo foi recebido')
    }
    const type = await FileType.fromFile(req.file.path)

    if (!type || !['jpg', 'png', 'jpeg'].includes(type.ext)) {
      await fs.promises.unlink(req.file.path)
      return res.status(422).send('Tipo de arquivo inválido')
    }

    const createDraft = container.resolve(CreateDraftUseCase)

    await createDraft.execute({
      accountId: id,
      image,
      theme,
    })

    return res.status(204).send()
  }
}

export default CreateDraftController
