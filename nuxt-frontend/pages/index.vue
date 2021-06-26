<template>
  <div>
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
    <button @click="checkout1">Checkout phase 1</button>
  </div>
</template>

<script>
export default {
  data() {
    this.pk = process.env.STRIPE_PK
    return {
      successUrl: 'http://localhost:3000',
      cancelUrl: 'http://localhost:3000',
      sessionId: null,
    }
  },
  methods: {
    checkout2() {
      return this.$refs.checkoutRef.redirectToCheckout()
    },
    checkout1() {
      const serverUrl = 'http://localhost:4242'
      fetch(`${serverUrl}/create-checkout-session`, {
        method: 'POST',
      })
        .then((response) => response.json())
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
</style>
