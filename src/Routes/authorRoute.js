import { Router } from "express";
import authorController from "../controllers/authorController.js";
const router = Router();
/**
 * @openapi
 * tags:
 *   name: Author
 *   description: API for Author operations
 */
/**
 * @openapi
 * /api/author:
 *   get:
 *     tags: [Author]
 *     description: Get list author
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
router.get("/", authorController.getAllAuthor);
/**
 * @openapi
 * /api/author/add:
 *   post:
 *     tags: [Author]
 *     description: Add authors
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  fullName:
 *                      type: string
 *                      description: The author's full name.
 *                      example: My Trần
 *                  status:
 *                      type: boolean
 *                      description: The author's stautus.
 *                      example: true
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
router.post("/add/", authorController.addAuthor);
/**
 * @openapi
 * /api/author/get:
 *   get:
 *     tags: [Author]
 *     description: Get author
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorId
 *         in: query
 *         required: false
 *         schema:
 *           type: String
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
router.get("/get/", authorController.getAuthor);
/**
 * @openapi
 * /api/author/update:
 *   put:
 *     tags: [Author]
 *     description: update information author
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorId
 *         in: query
 *         required: false
 *         schema: 
 *           type: String
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  fullName:
 *                      type: string
 *                      description: The author's name.
 *                      example: My Trần
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
router.put("/update/", authorController.updateAuthor);
/**
 * @openapi
 * /api/author/delete:
 *   put:
 *     tags: [Author]
 *     description: Delete author
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorId
 *         in: query
 *         required: false
 *         schema: 
 *           type: String
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
router.put("/delete/", authorController.deleteAuthor);
export default router;
