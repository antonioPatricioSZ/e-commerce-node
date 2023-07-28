import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication.js";
import { authRole } from "../middlewares/authorization.js";
("");

const router = Router();
// authenticateUser, authorizePermissions("admin"),
router.post("/", authenticateUser, authRole("ADMIN"), createProduct);
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);
router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateProduct
);
router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  deleteProduct
);

export default router;
