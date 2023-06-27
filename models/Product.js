import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({

   name: String,
   price: {
      type: Number,
      default: 0
   },
   description: String,
   image: String,
   category: {
      type: String,
      enum: ["office", "kitchen", "bedroom"]
   },
   company: {
      type: String,
      enum: ["ikea", "liddy", "marcos"]
   },
   colors: {
      type: [String],
      default: [ "#e1e" ]
   },
   featured: {
      type: Boolean,
      default: false
   },
   freeShipping: {
      type: Boolean,
      default: false
   },
   inventory: {
      type: Number,
      default: 15
   },
   averageRating: {
      type: Number,
      default: 0
   },
   numOfReviews: {
      type: Number,
      default: 0
   },
   user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
   }

}, {timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } } )

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});

export const Product = mongoose.model("Product", ProductSchema)