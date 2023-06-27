import { Router } from "express"

import { createOrder, getCurrentUserOrders, getAllOrders, getSingleOrder, updateOrder } from "../controllers/orderController.js"
import { authenticateUser, authorizePermissions } from "../middlewares/authentication.js"
''

const router = Router()

router.post("/", authenticateUser, createOrder)
router.get("/", authenticateUser, authorizePermissions("admin"), getAllOrders)

router.get("/showAllMyOrders", authenticateUser, getCurrentUserOrders)

router.get("/:id", authenticateUser, getSingleOrder)
router.patch("/:id", authenticateUser, updateOrder)


export default router