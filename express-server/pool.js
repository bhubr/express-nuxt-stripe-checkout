const mysql = require('mysql2')
const { promisify } = require('util')
const { user, password, database, host } = require('./config').mysql

const pool = mysql.createPool({
  user,
  password,
  database,
  host,
})

pool.queryAsync = promisify(pool.query.bind(pool))

module.exports = pool
