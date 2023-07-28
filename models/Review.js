import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
  {
    title: String,
    comment: String,
    rating: Number,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", ReviewSchema);
