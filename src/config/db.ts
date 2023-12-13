import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import Account from '../modules/accounts/infra/typeorm/entities/Account'
import Customer from '../modules/customers/infra/typeorm/entities/Customer'
import Dependent from '../modules/customers/infra/typeorm/entities/Dependent'
import Payment from '../modules/payments/infra/typeorm/entities/Payment'
import City from '../modules/cities/infra/typeorm/entities/City'
import Renegotiation from '../modules/payments/infra/typeorm/entities/Renegotiation'

let config: PostgresConnectionOptions

if (process.env.NODE_ENV === 'local') {
  config = {
    type: 'postgres',
    synchronize: false,
    logging: false,
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres',
    subscribers: [],
    entities: [Account, Customer, Dependent, Payment, City, Renegotiation],
    migrations: ['src/shared/infra/typeorm/migrations/*.ts'],
    migrationsRun: true,
    migrationsTableName: 'history',
  }
} else {
  config = {
    type: 'postgres',
    synchronize: false,
    ssl: true,
    logging: false,
    url: encodeURI(process.env.DATABASE_URL),
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    subscribers: [],
    entities: [Account, Customer, Dependent, Payment, City, Renegotiation],
    migrations: ['dist/shared/infra/typeorm/migrations/*.js'],
    migrationsRun: true,
    migrationsTableName: 'history',
  }
}

export default config
