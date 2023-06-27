import { Router } from "express"
import { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } from "../controllers/userController.js"
import { authenticateUser, authorizePermissions } from "../middlewares/authentication.js"
''

const router = Router()

router.get("/", authenticateUser, authorizePermissions("admin", "owner"), getAllUsers)
router.get("/showMe", authenticateUser, showCurrentUser)
router.patch("/updateUser", authenticateUser, updateUser)
router.patch("/updateUserPassword", authenticateUser, updateUserPassword)
// deve ser colocado no final se  ex: o /showMe vira params assim como o id
router.get("/:id", authenticateUser, getSingleUser)


// Se você precisa atualizar todos os campos de um recurso ou criar um recurso completamente novo, use o método PUT. Se deseja fazer atualizações parciais em um recurso, modificando apenas os campos relevantes, use o método PATCH.

export default router