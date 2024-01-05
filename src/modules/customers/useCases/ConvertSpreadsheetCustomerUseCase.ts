import { inject, injectable } from 'tsyringe'

import * as XLSX from 'xlsx'
import { IShowCustomerByCodeResponseDTO } from '../dtos/IShowCustomerByCodeResponseDTO'
import IAiProvider from '@shared/container/providers/AiProvider/models/IAiProvider'
import { IConvertSpreadsheetCustomerDTO } from '../dtos/IConvertSpreadsheetCustomerDTO'
import upload from '@config/upload'
import { resolve } from 'path'
import Renegotiation from '@modules/payments/infra/typeorm/entities/Renegotiation'
import ICreateOldRenegotiationDTO from '@modules/payments/dtos/ICreateOldRenegotiationDTO'
import ICustomerRepository from '../repositories/ICustomerRepository'
import IRenegotiationRepository from '@modules/payments/repositories/IRenegotiationRepository'
import IPaymentRepository from '@modules/payments/repositories/IPaymentRepository'
import AppError from '@shared/errors/AppError'
import Customer from '../infra/typeorm/entities/Customer'
import { makeCode } from '@config/utils/make_code'
import ICreateOldPaymentsDTO from '@modules/payments/dtos/ICreateOldPaymentsDTO'

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

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  const str2 = arr.join(' ')
  return str2
}

interface TableResponse {
  renegotiationsList: ICreateOldRenegotiationDTO[]
  paymentsList: ICreateOldPaymentsDTO[]
}

function getRenegotiationsAndPayments(
  worksheet: XLSX.WorkSheet,
): TableResponse {
  let lineInit: number
  let firstPayment: boolean = true

  let lastOfSentence: string = ''

  let paymentsList = []
  let renegotiationsList = []

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
            renegotiationsList.push(renegotiation)
            renegotiation = {}
          }
        }

        lastOfSentence = cellW
      } else {
        firstPayment = false
      }
    }
  }

  return {
    paymentsList,
    renegotiationsList,
  }
}

@injectable()
class ConvertSpreadsheetCustomerUseCase {
  constructor(
    @inject('AiProvider')
    private aiProvider: IAiProvider,

    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,

    @inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,

    @inject('RenegotiationRepository')
    private renegotiationRepository: IRenegotiationRepository,
  ) {}

  async execute({
    file,
    cityId,
  }: IConvertSpreadsheetCustomerDTO): Promise<Customer> {
    const originalName = resolve(upload.tmpFolder, file)
    const workbook = XLSX.readFile(originalName)

    // Convertendo a primeira aba do arquivo para JSON
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    const { paymentsList, renegotiationsList } = getRenegotiationsAndPayments(
      worksheet,
    )

    console.log(paymentsList)
    console.log(renegotiationsList)

    const csv = XLSX.utils.sheet_to_csv(worksheet)

    let customer: Customer | undefined

    try {
      const customerJson = await this.aiProvider.convertToJson(csv, cityId)

      let code: string

      console.log(customerJson)

      while (!code) {
        const codeGenerated = makeCode(8)

        const checkExistsTicketCode = await this.customerRepository.findByCode(
          codeGenerated,
        )

        if (!checkExistsTicketCode) code = codeGenerated
      }

      customerJson.code = code

      customer = await this.customerRepository.create(customerJson)

      paymentsList.map(e => {
        e.customerId = customer.id
        return e
      })

      renegotiationsList.map(e => {
        e.customerId = customer.id
        return e
      })

      await this.paymentRepository.createList(paymentsList)

      for (let index = 0; index < renegotiationsList.length; index++) {
        const element = renegotiationsList[index]

        await this.renegotiationRepository.createWithDates(element)
      }

      return customer
    } catch (error) {
      if (customer) await this.customerRepository.remove(customer)
      throw new AppError(error.message, 500)
    }
  }
}

export default ConvertSpreadsheetCustomerUseCase
