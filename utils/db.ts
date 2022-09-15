import { connect } from '@planetscale/database'

const config = {
  host: process.env.DATABASE_URL,
  username: '<user>',
  password: '<password>'
}

const conn = connect(config)

export default conn;