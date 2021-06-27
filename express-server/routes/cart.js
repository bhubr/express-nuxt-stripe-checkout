const express = require('express')
const Product = require('../models/product')

const router = express.Router()

router.post('/add', async (req, res) => {
  const { productId } = req.body
  const product = await Product.findOne(productId)
  let cart = req.session.cart || []
  const productInCart = cart.find((item) => item.product.id === productId)
  if (!productInCart) {
    cart = [...cart, { product, quantity: 1 }]
  } else {
    cart = cart.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    )
  }
  req.session.cart = cart
  res.send(cart)
})

router.put('/decrement/:productId', (req, res) => {
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
        : item,
    )
  }
  req.session.cart = cart
  res.send(cart)
})

router.get('/', (req, res) => res.send(req.session.cart || []))

module.exports = router
