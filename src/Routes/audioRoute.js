import { Router } from "express";
import audioController from "../Controllers/audioController.js";
import multer, { memoryStorage } from "multer";
const upload = multer({ storage: memoryStorage() });
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
/**
 * @openapi
 * /api/audio/add:
 *   post:
 *     tags: [Audios]
 *     description: Get list audios
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *          schema:
 *              type: object
 *              properties:
 *                  imageUrl:
 *                      type: file
 *                      description: the book's images
 *                      example: file
 *                  bookReview:
 *                      type: file
 *                      description: the book's book review
 *                      example: file
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
router.post("/add", upload.any(), audioController.addAudios);
export default router;
