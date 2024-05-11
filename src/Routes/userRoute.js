import { Router } from "express";
import userController from "../Controllers/userController.js";
const router = Router();
/**
 * @openapi
 * tags:
 *   name: User
 *   description: API for User operations
 */
/**
 * @openapi
 * /api/user:
 *   get:
 *     tags: [User]
 *     description: Get list users
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
router.get("/", userController.getAllUser);
/**
 * @openapi
 * /api/user/block:
 *   put:
 *     tags: [User]
 *     description: block user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
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
router.put("/block/", userController.blockUser);

export default router;
