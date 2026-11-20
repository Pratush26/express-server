import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { userRoles } from "../../lib/constants";

const router = Router();

router.post("/", userController.createUser);
router.get("/", auth(userRoles.admin, userRoles.manager), userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.put("/:id", userController.deleteUser);

export const userRoute = router;