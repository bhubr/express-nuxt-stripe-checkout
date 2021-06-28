module.exports = {
  stripeSk: process.env.STRIPE_SK,
  sessionSecret: process.env.SESSION_SECRET,
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
}
