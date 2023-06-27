import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({

   title: String,
   comment: String,
   rating: Number,
   user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
   },
   product: {
      type: mongoose.Types.ObjectId,
      ref: "Product"
   }

}, {timestamps: true} )
ReviewSchema.index( { product: 1, user: 1 }, { unique: true } )


ReviewSchema.statics.calculateAverageRating = async function(productId) {
   const result = await this.aggregate([
      { $match: { product: productId } },
      { $group: {
         _id: null,
         averageRating: { $avg: "$rating" },
         numOfReviews: { $sum: 1 }
      }}
   ])
   try {
      await this.model("Product").findOneAndUpdate(
         { _id: productId },
         { 
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0
         }
      )
   } catch (error) {
      
   }
}

ReviewSchema.post("save", async function() {
   await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post("remove", async function() {
   await this.constructor.calculateAverageRating(this.product)
})

export const Review = mongoose.model("Review", ReviewSchema)