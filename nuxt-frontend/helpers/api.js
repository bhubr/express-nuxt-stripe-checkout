import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
})

export const fetchProducts = () =>
  instance.get('/api/products').then((res) => res.data)

export const performCheckout = () =>
  instance.post('/api/orders/stripe-checkout').then((res) => res.data)

export const addToCart = (productId) =>
  instance.post('/api/cart/add', { productId }).then((res) => res.data)

export const decFromCart = (productId) =>
  instance.put(`/api/cart/decrement/${productId}`).then((res) => res.data)

export const fetchCart = () => instance.get('/api/cart').then((res) => res.data)
