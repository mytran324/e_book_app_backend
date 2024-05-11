import { Router } from "express";
import chaptersController from "../Controllers/chaptersController.js";
const router = Router();
/**
 * @openapi
 * tags:
 *   name: Chapters
 *   description: API for Chapters operations
 */
/**
 * @openapi
 * /api/chapter:
 *   get:
 *     tags: [Chapters]
 *     description: Get list chapters
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
router.get("/", chaptersController.getChapters);
/**
 * @openapi
 * /api/chapter/add:
 *   post:
 *     tags: [Chapters]
 *     description: Get list chapters
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  bookId:
 *                      type: string
 *                      description: the chapters's bookId
 *                      example: 123456
 *                  chapterList:
 *                      type: object
 *                      description: the chapters's chapters list
 *                      additionalProperties:
 *                          type: string
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/add/", chaptersController.addChapters);

export default router;
