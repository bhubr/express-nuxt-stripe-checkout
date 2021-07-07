const pool = require('../pool')

module.exports = {
  async findAll() {
    return pool.queryAsync('SELECT * FROM product')
  },

  async findOne(productId) {
    const [product] = await pool.queryAsync(
      'SELECT * FROM product WHERE id = ?',
      [productId],
    )
    if (!product) {
      throw new Error(`No product with id ${productId}`)
    }
    return product
  },

  async decreaseStock(productId, quantity) {
    const [product] = await pool.queryAsync(
      'SELECT * FROM product WHERE id = ?',
      [productId],
    )
    if (!product) {
      throw new Error(`No product with id ${productId}`)
    }
    await pool.queryAsync('UPDATE product SET stock = ? WHERE id = ?', [
      product.stock - quantity,
      productId,
    ])
  },

  async checkStock(productId, requiredQuantity) {
    const [product] = await pool.queryAsync(
      'SELECT stock FROM product WHERE id = ?',
      [productId],
    )
    if (!product) {
      throw new Error(`No product with id ${productId}`)
    }
    const isAvailable = product.quantity < requiredQuantity
    return { isAvailable, availableQuantity: productId.quantity }
  },

  async create(payload) {
    const { insertId: productId } = await pool.queryAsync(
      'INSERT INTO product SET ?',
      [payload],
    )
    return this.findOne(productId)
  },
}
