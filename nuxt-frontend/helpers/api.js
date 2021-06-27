import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
})

export const fetchProducts = () =>
  instance.get('/products').then((res) => res.data)

export const performCheckout = () =>
  instance.post('/create-checkout-session').then((res) => res.data)

export const addToCart = (productId) =>
  instance.post('/cart/add', { productId }).then((res) => res.data)

export const fetchCart = () => instance.get('/cart').then((res) => res.data)
