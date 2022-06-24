import all from 'faunadb'
const { Client } = all
import dotenv from 'dotenv'

dotenv.config()

export const fauna = new Client({
  secret: process.env.FAUNA_SECRET_KEY
})