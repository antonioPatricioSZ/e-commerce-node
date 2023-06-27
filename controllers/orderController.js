import { Product } from "../models/Product.js"
import { Order } from "../models/Order.js"

const fakeStripeApi = async ({ amount, currency }) => {
   const client_secret = "someRandomValue"
   return { 
      client_secret,
      amount
    }
}

const createOrder = async (req, res) => {
   const { items: cartItems, tax, shippingFee } = req.body

   if(!cartItems || cartItems.length < 1) {
      return res.status(400).json({ message: "No cart items provided" })
   }

   if(!tax || !shippingFee) {
      return res.status(400).json({ message: "Please provide tax and shipping fee" })
   }

   let orderItems = []
   let subtotal = 0

   for(const item of cartItems) {

      const dbProduct = await Product.findOne({_id: item.product})
      if(!dbProduct) {
         return res.status(404).json({ message: "Product not found!!" })
      }

      const { name, price, image, _id } = dbProduct
      console.log(price)
      console.log(item.amount)
      const singleOrderItem = {
         amount: item.amount,
         name,
         price,
         image,
         product: _id
      }

      // add item to order
      orderItems = [...orderItems, singleOrderItem]

      // calculate subtotal
      subtotal += (item.amount * price)
      console.log(subtotal)
   }
   console.log(subtotal)

   // calculate total
   const total = tax + shippingFee + subtotal
   // get client secret
   const paymentIntent = await fakeStripeApi({
      amount: total,
      currency: "usd"
   })

   const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId
   })

   res.status(201).json({ order,  clientSecret: order.clientSecret })

}

const getAllOrders = async (req, res) => {
   const orders = await Order.find({})
   res.json( { orders, count: orders.length } )
}

const getSingleOrder = async (req, res) => {

   const { id: orderId } = req.params

   const order = await Order.findOne({_id: orderId})
   if(!order) {
      return res.status(404).json({ message: "Order not found!!" })
   }

   if(req.user.userId !== order.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to access this route" })
   }

   res.status(200).json(order)

}

const getCurrentUserOrders = async (req, res) => {
   const orders = await Order.find({ user: req.user.userId })
   res.json( { orders, count: orders.length } )
}

const updateOrder = async (req, res) => {

   const { id: orderId } = req.params
   const { paymentIntentId } = req.body

   const order = await Order.findOne({ _id: orderId })
   if(!order) {
      return res.status(404).json({ message: "Order not found" })
   }

   if(req.user.userId !== order.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to access this route" })
   }

   order.paymentIntentId = paymentIntentId
   order.status = "paid"
   await order.save()

   res.status(200).json(order)

}



export {
   createOrder, 
   getAllOrders,
   getSingleOrder,
   updateOrder,
   getCurrentUserOrders
}