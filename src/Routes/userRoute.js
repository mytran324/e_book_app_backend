import { Router } from "express";
import userController from "../Controllers/userController.js";
const router = Router();

router.get("/", userController.getAllUser);
router.put("/block/", userController.blockUser);

export default router;
