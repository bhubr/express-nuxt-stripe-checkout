require('dotenv').config()
const Product = require('./models/product')

const products = [
  {
    id: 1,
    name: 'John Mayer - Sob Rock',
    images: [
      'https://www.premierguitar.com/media-library/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8yNjU4MjE0NC9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTYzMDE3OTA1NX0.5wjQD3R9nBHDflNZvDArnUj69M_I0zpBLQ5CtBjV_BU/image.jpg?width=1200&height=1200',
    ],
    price: 1599,
  },
  {
    id: 2,
    name: 'John Mayer - The Search for Everything',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/61UmJ0SzZhL._SX425_.jpg',
    ],
    price: 1000,
  },
  {
    id: 3,
    name: 'Black Pumas - Black Pumas',
    images: [
      'https://images-na.ssl-images-amazon.com/images/I/61iYFiqfMAL._SL1200_.jpg',
    ],
    price: 1499,
  },
]

// const insertPromises = products.map((p) =>
//   Product.create({
//     name: p.name,
//     image_url: p.images[0],
//     price: p.price,
//     stock: 5,
//   }),
// )
// Promise.all(insertPromises).then(console.log)

module.exports = products
