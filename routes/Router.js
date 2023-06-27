import { Router } from "express"

import authRouter from "./authRoutes.js"
import userRouter from "./userRoutes.js"
import productRouter from "./productRoutes.js"
import reviewRouter from "./reviewRoutes.js"
import orderRouter from "./orderRoutes.js"

const router = Router()

router.use("/auth", authRouter)
router.use("/users", userRouter)
router.use("/products", productRouter)
router.use("/reviews", reviewRouter)
router.use("/orders", orderRouter)

export default router