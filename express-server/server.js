require('dotenv').config()
const { stripeSk } = require('./config')
const stripe = require('stripe')(stripeSk)
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.static('.'))
app.use(cors())

const YOUR_DOMAIN = 'http://localhost:3000'

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'John Mayer - Sob Rock',
            images: [
              'https://www.premierguitar.com/media-library/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8yNjU4MjE0NC9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTYzMDE3OTA1NX0.5wjQD3R9nBHDflNZvDArnUj69M_I0zpBLQ5CtBjV_BU/image.jpg?width=1200&height=1200',
            ],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'John Mayer - The Search for Everything',
            images: [
              'https://images-na.ssl-images-amazon.com/images/I/61UmJ0SzZhL._SX425_.jpg',
            ],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  })

  res.json({ id: session.id })
})

app.listen(4242, () => console.log('Running on port 4242'))
