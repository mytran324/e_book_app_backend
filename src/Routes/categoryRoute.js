import { Router } from "express";
import categoryController from "../Controllers/categoryController.js";
import multer, { memoryStorage } from "multer";

const router = Router();

const upload = multer({ storage: memoryStorage() });
/**
 * @openapi
 * tags:
 *   name: Categotry
 *   description: API for Author operations
 */
/**
 * @openapi
 * /api/category:
 *   get:
 *     tags: [Categotry]
 *     description: Get list category
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
router.get("/", categoryController.getAllCategory);
/**
 * @openapi
 * /api/category/add:
 *   post:
 *     tags: [Category]
 *     description: Get list category
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *          schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The category's title.
 *                      example: Code clean
 *                  imageUrl:
 *                      type: file
 *                      description: the category's images
 *                      example: file
 *                  status:
 *                      type: boolean
 *                      description: the category's status
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
router.post("/add/", upload.single("imageUrl"), categoryController.addCategory);
/**
 * @openapi
 * /api/category/get:
 *   get:
 *     tags: [Category]
 *     description: Get information category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: categoryId
 *         in: query
 *         required: false
 *         schema:
 *            type: string
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
router.get("/get/", categoryController.getCategory);
router.put(
  "/update/",
  upload.single("imageUrl"),
  categoryController.updateCategory
);
router.put("/delete/", categoryController.deleteCategory);

export default router;
