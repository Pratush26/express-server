import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", userController.createUser);
router.get("/", auth, userController.getAllUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.put("/:id", userController.deleteUser);

export const userRoute = router;