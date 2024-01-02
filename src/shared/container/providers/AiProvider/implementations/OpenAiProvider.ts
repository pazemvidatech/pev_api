import { OpenAI } from 'openai'
import IAiProvider from '../models/IAiProvider'
import AppError from '@shared/errors/AppError'

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the customer holder',
    },
    silverPlan: {
      type: 'boolean',
      description: 'If it is Prata plan',
    },
    frequency: {
      type: 'integer',
      description:
        'If you have written the frequency in months for payments, if not, the value is 3',
    },
    numberId: {
      type: 'string',
      description: 'It is a number of register',
    },
    address: {
      type: 'string',
      description: 'The address of the customer',
    },
    email: {
      type: 'string',
      description: 'The customers mail, if not available, must be null',
    },
    document: {
      type: 'string',
      description: 'The customers CPF, if not available, must be null',
    },
    oldRegister: {
      type: 'boolean',
      description: 'Aways true',
    },
    payday: {
      type: 'integer',
      description: 'Its a payday of client',
    },
    dependents: {
      type: 'array',
      description: 'This list contains dependents and deceased',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Dependent name',
          },
          deathDate: {
            type: 'string',
            description:
              'Add data if the person has died, if not, must be null',
          },
        },
        required: ['name'],
      },
    },
    payments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: {
            type: 'integer',
            description: 'Month in number of the payment, january is equal 1',
          },
          year: {
            type: 'integer',
            description: 'Year in number of the payment',
          },
          amount: {
            type: 'integer',
            description:
              'amount payed in payment in cents, R$ 20,00 equal 2000',
          },
        },
        required: ['month', 'year', 'amount'],
      },
    },
    cityId: {
      type: 'string',
      description: 'The value cityId passed in body',
    },
  },
  required: [
    'name',
    'silverPlan',
    'frequency',
    'numberId',
    'address',
    'email',
    'document',
    'oldRegister',
    'payday',
    'dependents',
    'payments',
    'cityId',
  ],
}

class OpenAiProvider implements IAiProvider {
  private openai: OpenAI

  constructor() {
    const configuration = {
      apiKey: process.env.OPENAI_API_KEY,
    }
    this.openai = new OpenAI(configuration)
  }

  public async convertToJson(content: string, cityId: string): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You convert customer spreadsheet data that is in string to json',
          },
          { role: 'system', content: `The cityId is "${cityId}"` },
          { role: 'user', content: content },
        ],
        functions: [
          {
            name: 'get_customer',
            description:
              'Get the customer information from the body of the input text',
            parameters: schema,
          },
        ],
        function_call: { name: 'get_customer' },
        temperature: 0.2,
      })

      const response = JSON.parse(
        completion.choices[0].message.function_call.arguments,
      )

      return response
    } catch (error) {
      console.log(error)
      console.log(error.message)
      if (error.response) {
        throw new AppError(error.response.data)
      } else {
        throw new AppError(error.message)
      }
    }
  }
}

export default OpenAiProvider
