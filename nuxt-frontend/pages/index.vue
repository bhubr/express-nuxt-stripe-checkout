<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <img class="product-img" :src="product.image_url" />
      <p>{{ (product.unit_amount / 100).toFixed(2) }}€</p>
      <button type="button" @click="increment(product.id)">Add to cart</button>
    </div>
    <div v-if="sessionId !== null">
      <p>{{ sessionId }}</p>
      <stripe-checkout
        ref="checkoutRef"
        :pk="pk"
        :session-id="sessionId"
        :success-url="successUrl"
        :cancel-url="cancelUrl"
      />
    </div>
    <div>
      <h3>Cart</h3>
      <div v-for="item in cartItems" :key="item.product.id">
        <span>{{ item.product.name }}</span>
        <img class="cart-img" :src="item.product.image_url" />
        <button type="button" @click="decrement(item.product.id)">-</button>
        {{ item.quantity }}
        <button type="button" @click="increment(item.product.id)">+</button>
      </div>
    </div>
    <button @click="checkout">Checkout</button>
  </div>
</template>

<script>
import {
  fetchProducts,
  performCheckout,
  fetchCart,
  addToCart,
  decFromCart,
} from '@/helpers/api'

export default {
  data() {
    this.pk = process.env.STRIPE_PK
    return {
      successUrl: 'http://localhost:3000',
      cancelUrl: 'http://localhost:3000',
      products: [],
      cartItems: [],
      sessionId: null,
    }
  },
  mounted() {
    fetchProducts()
      .then((products) => {
        this.products = products
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    fetchCart().then((cart) => {
      this.cartItems = cart
    })
  },
  methods: {
    checkout() {
      performCheckout()
        .then((session) => {
          this.sessionId = session.id
          setTimeout(() => {
            this.$refs.checkoutRef.redirectToCheckout()
          }, 200)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
    increment(productId) {
      addToCart(productId).then((cart) => {
        this.cartItems = cart
      })
    },
    decrement(productId) {
      decFromCart(productId).then((cart) => {
        this.cartItems = cart
      })
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.product-img {
  max-width: 192px;
}

.cart-img {
  max-width: 64px;
}
</style>
