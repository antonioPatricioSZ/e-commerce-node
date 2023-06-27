import { Router } from "express"
import { createReview, deleteReview, getAllReviews, getSingleReview, updateReview } from "../controllers/reviewController.js"
import { authenticateUser } from "../middlewares/authentication.js"
''

const router = Router()

router.post("/", authenticateUser, createReview)
router.get("/", getAllReviews)

router.get("/:id", getSingleReview)

router.patch("/:id", authenticateUser, updateReview)
router.delete("/:id", authenticateUser, deleteReview)


export default router