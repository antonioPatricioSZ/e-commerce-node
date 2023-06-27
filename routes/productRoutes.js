import { Router } from "express"
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct, uploadImage } from "../controllers/productController.js"
import { authenticateUser, authorizePermissions } from "../middlewares/authentication.js"
''

const router = Router()

router.post("/", authenticateUser, authorizePermissions("admin"), createProduct)
router.get("/", getAllProducts)

router.post("/uploadImage", authenticateUser, authorizePermissions("admin"), uploadImage)

router.get("/:id", getSingleProduct)
router.patch("/:id", authenticateUser, authorizePermissions("admin"), updateProduct)
router.delete("/:id", authenticateUser, authorizePermissions("admin"), deleteProduct)


export default router