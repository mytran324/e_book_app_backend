import { Router } from "express";
import userController from "../controllers/userController.js";
const router = Router();

router.get("/", userController.getAllUser);
router.put("/block/", userController.blockUser);

export default router;
