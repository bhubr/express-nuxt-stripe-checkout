const pool = require('../pool')

module.exports = {
  async findAll() {
    return pool.queryAsync('SELECT * FROM `order`')
  },

  async findOne(orderId) {
    const [order] = await pool.queryAsync(
      'SELECT * FROM `order` WHERE id = ?',
      [orderId],
    )
    if (!order) {
      throw new Error(`No order with id ${orderId}`)
    }
    return order
  },

  async findOneByStripeCheckoutId(sessionId) {
    const [order] = await pool.queryAsync(
      'SELECT * FROM `order` WHERE stripe_checkout_id = ?',
      [sessionId],
    )
    if (!order) {
      throw new Error(`No order with id ${sessionId}`)
    }
    const items = await pool.queryAsync(
      'SELECT * FROM `order_product` WHERE order_id = ?',
      [order.id],
    )
    return {
      ...order,
      items,
    }
  },

  async update(orderId, payload) {
    const { items, ...rest } = payload
    console.log('order/payliad', orderId, rest)
    await pool.queryAsync('UPDATE `order` SET ? WHERE id = ?', [rest, orderId])
  },

  async create(payload, items) {
    const totalAmount = items.reduce(
      (sum, { product, quantity }) => sum + quantity * product.unit_amount,
      0,
    )
    const realPayload = {
      ...payload,
      reference: `tmp-${Date.now()}`,
      currency: 'eur',
      total_amount: totalAmount,
    }
    const { insertId: orderId } = await pool.queryAsync(
      'INSERT INTO `order` SET ?',
      [realPayload],
    )
    const relations = items.map(({ product, quantity }) => [
      orderId,
      product.id,
      product.unit_amount,
      quantity,
    ])
    await pool.queryAsync(
      'INSERT INTO `order_product` (order_id, product_id, unit_amount, quantity) VALUES ?',
      [relations],
    )
    return this.findOne(orderId)
  },
}
