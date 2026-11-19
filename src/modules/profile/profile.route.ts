import { Router } from "express";
import { profileController } from "./profile.controller";

const router = Router();

router.post("/", profileController.createProfile);
router.get("/", profileController.getAllProfiles);
router.get("/:id", profileController.getMyProfile);
router.put("/:id", profileController.updateProfile);
router.put("/:id", profileController.deleteProfile);

export const profileRoute = router;