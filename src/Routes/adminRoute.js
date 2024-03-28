import { Router } from "express";
import adminController from "../Controllers/adminController.js";
const router = Router();
/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: API for admin operations
 */
/**
 * @openapi
 * /api/admin/profile:
 *   get:
 *     tags: [Admin]
 *     description: get profile Admin
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
router.get("/profile/", adminController.getProfile);
/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     tags: [Admin]
 *     description: Login admin
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      description: The admin's email.
 *                      example: mytran20110324@gmail.com
 *                  password:
 *                      type: string
 *                      description: The admin's password.
 *                      example: My123456@
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/login/", adminController.loginAdmin);

export default router;
