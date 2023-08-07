import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({

   name: String,
   email: String,
   password: String,
   role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER"
   },
   image: String

})

UserSchema.pre("save", async function() {
   this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
   const isMatch = await bcrypt.compare(candidatePassword, this.password)
   return isMatch
}

export const User = mongoose.model("User", UserSchema)