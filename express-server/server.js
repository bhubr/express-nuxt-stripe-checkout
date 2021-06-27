require('dotenv').config()
const { stripeSk, sessionSecret } = require('./config')
const stripe = require('stripe')(stripeSk)
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const products = require('./products')

const app = express()
app.use(express.json())
app.use(express.static('.'))
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
)

const YOUR_DOMAIN = 'http://localhost:3000'

app.get('/products', (req, res) => res.send(products))

app.post('/cart/add', (req, res) => {
  const { productId } = req.body
  const product = products.find((p) => p.id === productId)
  let cart = req.session.cart || []
  const productInCart = cart.find((item) => item.product.id === productId)
  if (!productInCart) {
    cart = [...cart, { product, quantity: 1 }]
  } else {
    cart = cart.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  }
  req.session.cart = cart
  res.send(cart)
})

app.put('/cart/decrement/:productId', (req, res) => {
  const productId = Number(req.params.productId)
  if (Number.isNaN(productId)) {
    return res.status(400).send({
      error: `Invalid product id ${productId}`,
    })
  }
  let cart = req.session.cart || []
  const productIdx = cart.findIndex((item) => item.product.id === productId)
  const product = cart[productIdx]
  if (product.quantity === 1) {
    cart.splice(productIdx, 1)
  } else {
    cart = cart.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
  }
  req.session.cart = cart
  res.send(cart)
})

app.get('/cart', (req, res) => res.send(req.session.cart || []))

app.post('/create-checkout-session', async (req, res) => {
  const cartItems = req.session.cart.map(({ quantity, product }) => ({
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
