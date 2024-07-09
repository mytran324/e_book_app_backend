import { Router } from "express";
import audioController from "../Controllers/audioController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Audios
 *   description: API for Audios operations
 */
/**
 * @openapi
 * /api/audio:
 *   get:
 *     tags: [Audios]
 *     description: Get list audios
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
router.get("/", audioController.getAudios);


export default router;
