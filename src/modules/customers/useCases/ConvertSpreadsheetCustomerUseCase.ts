import { inject, injectable } from 'tsyringe'

import * as XLSX from 'xlsx'
import { IShowCustomerByCodeResponseDTO } from '../dtos/IShowCustomerByCodeResponseDTO'
import IAiProvider from '@shared/container/providers/AiProvider/models/IAiProvider'
import { IConvertSpreadsheetCustomerDTO } from '../dtos/IConvertSpreadsheetCustomerDTO'
import upload from '@config/upload'
import { resolve } from 'path'
import Renegotiation from '@modules/payments/infra/typeorm/entities/Renegotiation'
import ICreateOldRenegotiationDTO from '@modules/payments/dtos/ICreateOldRenegotiationDTO'

const monthsLetters = [
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
]

function letterToMonthNumber(letter: string) {
  const index = monthsLetters.indexOf(letter)

  return index + 1
}

function capitalizeFirstLetter(str: string): string {
  const arr = str.split(' ')

  //loop through each element of the array and capitalize the first letter.

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  //Join all the elements of the array back into a string
  //using a blankspace as a separator
  const str2 = arr.join(' ')
  return str2
}

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

    let lineInit: number
    let firstPayment: boolean = true

    let lastOfSentence: string = ''

    let paymentsList = []
    let renegotiationList = []

    let renegotiation: ICreateOldRenegotiationDTO = {}

    for (let cell in worksheet) {
      const cellData = worksheet[cell]
      const cellValue: any = cellData.v
      const cellW: string = cellData.w

      if (cellValue === 'ANOS') lineInit = parseInt(cell[1])

      if (
        parseInt(cell.substring(1)) > lineInit &&
        cellValue != '' &&
        monthsLetters.includes(cell[0])
      ) {
        if (!firstPayment) {
          const isRenegotiation =
            cellW.includes('XX') ||
            (lastOfSentence.includes('XX') && !cellW.includes('XX')) ||
            cellW.includes('REN')

          const month = letterToMonthNumber(cell[0])
          const year = worksheet['A' + cell.substring(1)].v

          if (!isRenegotiation) {
            const amount = cellW
              .toUpperCase()
              .replace(/[R\$C\.\,]/g, '')
              .replace(/O/g, '0')
              .trim()

            const payment = { amount: parseInt(amount), month, year }

            paymentsList.push(payment)
          } else {
            if (!renegotiation.amount) renegotiation.amount = 10000
            if (!lastOfSentence.includes('XX') && cellW.includes('XX')) {
              renegotiation.initialMonth = month
              renegotiation.initialYear = year
            } else if (cellW.includes('REN')) {
              renegotiation.finalMonth = month
              renegotiation.finalYear = year
            } else if (lastOfSentence.includes('XX') && !cellW.includes('XX')) {
              renegotiation.negotiator = capitalizeFirstLetter(
                cellW.toLowerCase(),
              )
            }

            if (
              renegotiation.amount &&
              renegotiation.initialMonth &&
              renegotiation.initialYear &&
              renegotiation.finalMonth &&
              renegotiation.finalYear &&
              renegotiation.negotiator
            ) {
              renegotiationList.push(renegotiation)
              renegotiation = {}
            }
          }

          lastOfSentence = cellW
        } else {
          firstPayment = false
        }
      }
    }

    console.log(paymentsList)
    console.log(renegotiationList)
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
