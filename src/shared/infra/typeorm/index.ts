import { DataSource } from 'typeorm'
import 'dotenv/config'
import dbCongig from '../../../config/db'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const AppDataSource = new DataSource(dbCongig as PostgresConnectionOptions)

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err)
  })

export default AppDataSource
