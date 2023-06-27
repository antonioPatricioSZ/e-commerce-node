import mongoose from "mongoose";


const SingleOrderItemSchema = new mongoose.Schema({
   name: String,
   image: String,
   price: Number,
   amount: Number,
   product: {
      type: mongoose.Types.ObjectId,
      ref: "Product"
   }
})


const OrderSchema = new mongoose.Schema({

   tax: Number,
   shippingFee: Number,
   subtotal: Number,
   total: Number,
   orderItems: [SingleOrderItemSchema],
   status: {
      type: String,
      enum: ["pending", "failed", "delivered", "paid", "canceled"],
      default: "pending"
   },
   user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
   },
   clientSecret: String,
   paymentIntentId: String

}, {timestamps: true } )


export const Order = mongoose.model("Order", OrderSchema)