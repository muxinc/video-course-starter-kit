import { connect } from '@planetscale/database'

const config = {
  host: process.env.DATABASE_URL,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
}

const conn = connect(config)

export default conn;