require('dotenv').config()
const { stripeSk } = require('./config')
const stripe = require('stripe')(stripeSk)
const express = require('express')
const cors = require('cors')
const products = require('./products')

const app = express()
app.use(express.json())
app.use(express.static('.'))
app.use(cors())

const YOUR_DOMAIN = 'http://localhost:3000'

app.get('/products', (req, res) => res.send(products))

app.post('/create-checkout-session', async (req, res) => {
  const cartItems = req.body.map(({ quantity, product }) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: product.name,
        images: product.images,
      },
      unit_amount: product.unit_amount,
    },
    quantity,
  }))
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cartItems,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  })

  res.json({ id: session.id })
})

app.listen(4242, () => console.log('Running on port 4242'))
