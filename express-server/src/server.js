require('dotenv').config()
const { sessionSecret } = require('./config')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const api = require('./routes')

const app = express()
app.use(express.json())
app.use(express.static('.'))
app.use(
  cors({
    // Nuxt client & Angular client
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  }),
)
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
  }),
)
app.use('/api', api)

app.listen(4242, () => console.log('Running on port 4242'))
