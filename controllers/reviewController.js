import { Product } from "../models/Product.js"
import { Review } from "../models/Review.js"

const createReview = async (req, res) => {
   
   const { product: productId } = req.body
   const reqUserId = req.user.userId

   const product = await Product.findOne({_id: productId})
   if(!product) {
      return res.status(404).json({ message: "Product not found" })
   }

   const alreadySubmitted = await Review.findOne({ product: productId, user: reqUserId })
   // se esse review já tiver um produto e um usuário dá erro, mas se for com outro usuario não dá erro
   if(alreadySubmitted) {
      return res.status(404).json({ message: "Already submmited review for this product" })
   }

   req.body.user = reqUserId
   const review = await Review.create(req.body)
   res.status(201).json(review)

}

const getAllReviews = async (req, res) => {
  
   const reviews = await Review.find({}).populate("product").populate("user")
   res.json({ reviews })

}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findById(reviewId)
  // .populate({
  //   path: "product",
  //   select: "name price company category"
  //})
  .populate({
     path: "user",
     select: "name email role"
  })
  if(!review) {
      return res.status(404).json({ message: "Review not found" })
   }

  res.json(review)
}

const deleteReview = async (req, res) => {

   const { id: reviewId } = req.params

  const review = await Review.findById(reviewId)
  if(!review) {
      return res.status(404).json({ message: "Review not found" })
   }

      // if(req.user.role !== "admin") {
      //    return res.status(403).json({ message: "Unauthorized to access this route" })
      // }
   
   if(req.user.userId !== review.user.toString()) {
      return res.status(403).json({ message: "Unauthorized to access this route" })
   }

   await Review.findByIdAndDelete(reviewId)

   res.status(200).json({ message: "Product removed!" })

}

const updateReview = async (req, res) => {
   const { id: reviewId } = req.params
   const { title, rating, comment } = req.body

   const review = await Review.findById(reviewId)
   if(!review) {
      return res.status(404).json({ message: "Review not found" })
   }

   // if(req.user.role !== "admin") {
   //    return res.status(403).json({ message: "Unauthorized to access this route" })
   // }

   // if(req.user.userId !== review.user.toString()) {
   //    return res.status(403).json({ message: "Unauthorized to access this route" })
   // }

   review.title = title
   review.rating = rating
   review.comment = comment

   await review.save()

   res.json(review)
   
}



export {
   createReview, 
   getAllReviews,
   getSingleReview,
   updateReview,
   deleteReview
}