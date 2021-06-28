const express = require('express')
const products = require('./products')
const cart = require('./cart')
const orders = require('./orders')

const router = express.Router()
router.use('/products', products)
router.use('/cart', cart)
router.use('/orders', orders)

module.exports = router
