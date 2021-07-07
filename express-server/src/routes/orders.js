const express = require('express')
const Order = require('../models/order')
const Product = require('../models/product')
const { stripeSk } = require('../config')
const stripe = require('stripe')(stripeSk)

const router = express.Router()

const YOUR_DOMAIN = 'http://localhost:4242'

router.post('/stripe-checkout', async (req, res) => {
  const cartItems = req.session.cart.map(({ quantity, product }) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: product.name,
        images: [product.image_url],
      },
      unit_amount: product.price,
    },
    quantity,
  }))
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cartItems,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/api/orders/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  })

  const order = await Order.create(
    {
      stripe_checkout_id: session.id,
    },
    req.session.cart,
  )

  res.json({ id: session.id, orderId: order.id })
})

router.get('/stripe-success', async (req, res) => {
  const { session_id: sessionId } = req.query
  const order = await Order.findOneByStripeCheckoutId(sessionId)
  // if (order.status !== 'new') {
  //   return res.status(409).send({
  //     error: 'Order already fulfilled/cancelled',
  //   })
  // }
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const {
    payment_status: paymentStatus,
    customer_details: { email },
  } = session
  if (paymentStatus !== 'paid') {
    return res.status(409).json({
      error: `Invalid payment status ${paymentStatus}`,
    })
  }
  // res.json({ order, session })
  await Order.update(order.id, {
    ...order,
    customer_email: email,
    status: 'fulfilled',
  })
  const updateStockPromises = order.items.map((item) =>
    Product.decreaseStock(item.product_id, item.quantity),
  )
  await Promise.all(updateStockPromises)
  res.redirect('http://localhost:3000')
})

module.exports = router
