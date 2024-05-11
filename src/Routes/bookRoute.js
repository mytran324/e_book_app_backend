import { Router } from "express";
import bookController from "../Controllers/bookController.js";
import multer, { memoryStorage } from "multer";
const router = Router();

const upload = multer({ storage: memoryStorage() });
/**
 * @openapi
 * tags:
 *   name: Book
 *   description: API for Author operations
 */
/**
 * @openapi
 * /api/book:
 *   get:
 *     tags: [Book]
 *     description: Get list book
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
router.get("/", bookController.getAllBook);

/**
 * @openapi
 * /api/book/get:
 *   get:
 *     tags: [Book]
 *     description: Get information book
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bookId
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
router.get("/get/", bookController.getBook);
/**
 * @openapi
 * /api/book/viewBooks:
 *   get:
 *     tags: [Book]
 *     description: Get books's views
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
router.get("/viewBooks", bookController.viewBooks);
/**
 * @openapi
 * /api/book/totalViews:
 *   get:
 *     tags: [Book]
 *     description: Get total views
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
router.get("/totalViews", bookController.totalViews);
router.put("/delete/", bookController.deleteBook);
router.delete("/remove/", bookController.removeBook);
/**
 * @openapi
 * /api/book/add:
 *   post:
 *     tags: [Book]
 *     description: Get list book
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *          schema:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: The book's title.
 *                      example: Code clean
 *                  authodId:
 *                      type: string
 *                      description: The book's author.
 *                      example: EtZb3sKoCLxy538UjzIq
 *                  categoryId:
 *                      type: string
 *                      description: the book's category
 *                      example: VEZY24T7lmscpJb5X1zk
 *                  description:
 *                      type: string
 *                      description: the book's description
 *                      example: tóm tắt ....
 *                  language:
 *                      type: string
 *                      description: the book's language
 *                      example: Vietnamese
 *                  chapters:
 *                      type: string
 *                      description: the book's chapters
 *                      example: 10
 *                  country:
 *                      type: integer
 *                      description: the book's country
 *                      example: Vietnam
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
router.post(
  "/add/",
  upload.fields([{ name: "bookReview" }, { name: "imageUrl" }]),
  bookController.addBook
);
export default router;
