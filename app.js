import { config } from "dotenv";
config()
import express from "express";
import { conectDB } from "./db/connection.js";
import routesController from './routes/Router.js'
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload'
import rateLimiter from "express-rate-limit";
import cors from "cors";
import xss from "xss";
import mongoSanitaze from "express-mongo-sanitize";

const app = express()
const port = process.env.PORT || 5000

app.set("trust proxy", 1)
app.use(rateLimiter({
   windowMs: 15 * 60 * 1000,
   max: 60
}))

app.use(cors())
app.use(xss())
app.use(mongoSanitaze())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static("./public"))
app.use(fileUpload())

app.use("/api/v1", routesController)

const start = async () => {
   try {
      await conectDB(process.env.MONGO_URL)
      app.listen(port, console.log(`Server is running on port ${port}`))
   } catch (error) {
      console.log(error)
   }
}
start()