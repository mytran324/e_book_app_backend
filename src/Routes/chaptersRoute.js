import { Router } from "express";
import chaptersController from "../Controllers/chaptersController.js";
const router = Router();

router.get("/", chaptersController.getChapters);
router.post("/add/", chaptersController.addChapters);

export default router;
