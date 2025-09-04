const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

async function createOrder({ userId, products }) {
  // calculate total price
  let totalPrice = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);

    totalPrice += product.price * item.quantity;
  }

  // create order
  const order = new Order({
    user: userId,
    products,
    totalPrice,
  });

  const newOrder = await order.save();

  // return populated order
const populatedOrder = await newOrder.populate([
  { path: "user", select: "name email" },
  { path: "products.product", select: "name price" },
]);

return populatedOrder;
}

module.exports = { createOrder };
