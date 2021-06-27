CREATE TABLE IF NOT EXISTS product (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200),
  description MEDIUMTEXT,
  unit_amount INTEGER NOT NULL,
  image_url VARCHAR(512),
  stock INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS `order` (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `status` ENUM('new', 'fulfilled', 'cancelled') DEFAULT 'new',
  stripe_checkout_id VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_shipping_address VARCHAR(255),
  customer_billing_address VARCHAR(255),
  reference VARCHAR(25) NOT NULL,
  total_amount INTEGER NOT NULL,
  currency VARCHAR(3),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_product(
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  unit_amount INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);