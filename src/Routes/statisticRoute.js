import { Router } from "express";
import statisticController from "../Controllers/statisticController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Statistic
 *   description: API for Statistic operations
 */
/**
 * @openapi
 * /api/statistic:
 *   get:
 *     tags: [Statistic]
 *     description: get Statistic
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", statisticController.getStatistic);
export default router;
