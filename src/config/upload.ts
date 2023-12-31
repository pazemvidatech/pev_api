import AppError from '@shared/errors/AppError'
import { randomBytes } from 'crypto'
import { diskStorage } from 'multer'
import { resolve } from 'path'

const tmpFolder = resolve(__dirname, '..', '..', 'tmp')

const MAX_SIZE = 15 * 1024 * 1024 // 15MB

export default {
  tmpFolder,
  limits: { fileSize: MAX_SIZE },
  storage: diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = randomBytes(16).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    },
  }),
  fileFilter: async (req, file, cb) => {
    console.log(file.mimetype)
    if (!file.mimetype.match(/(xls|xlsx|XLS|XLSX|excel)$/)) {
      return cb(new AppError('Only XLS and XLSX files are allowed!'), false)
    }

    const filetypes = /xls|xlsx|/
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype) {
      return cb(null, true)
    }

    cb(
      new Error(
        `File upload only supports the following filetypes - ${filetypes}`,
      ),
    )
  },
}
