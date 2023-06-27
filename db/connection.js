import mongoose from 'mongoose'

export const conectDB = (url) => {
   return mongoose.connect(url)
}
