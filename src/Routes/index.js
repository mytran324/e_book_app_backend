import { Router } from "express";
import adminRoutes from "./adminRoute.js";
import authorRoutes from "./authorRoute.js";
import bookRoutes from "./bookRoute.js";
import categoryRoutes from "./categoryRoute.js";
import chaptersRoutes from "./chaptersRoute.js";
import userRoutes from "./userRoute.js";
import missionRoutes from "./missionRoute.js";
// import coinsRoutes from "./coinsRoute.js";
import notificationRoutes from "./notificationRoute.js";
const router = Router();

router.use("/admin", adminRoutes);
router.use("/author", authorRoutes);
router.use("/book", bookRoutes);
router.use("/category", categoryRoutes);
router.use("/chapters", chaptersRoutes);
router.use("/user", userRoutes);
router.use("/mission", missionRoutes);
// router.use("/coins", coinsRoutes);
router.use("/notification", notificationRoutes);


export default router;
