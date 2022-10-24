import { connect } from '@planetscale/database'

const config = {
  host: process.env.DATABASE_URL,
}

const conn = connect(config)

export default conn;