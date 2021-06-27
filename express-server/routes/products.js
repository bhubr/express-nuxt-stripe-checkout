const express = require('express')
const Product = require('../models/product')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll()
    res.send(products)
  } catch (e) {
    res.status(500).send({
      error: e.message,
    })
  }
})

module.exports = router
