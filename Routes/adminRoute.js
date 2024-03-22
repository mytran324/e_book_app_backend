const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
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
 *     summary: Lấy thông tin hồ sơ admin
 *     description: Lấy thông tin hồ sơ của admin từ cơ sở dữ liệu.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ admin đã được lấy thành công.
 */
router.get("/profile/", adminController.getProfile);
/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     tags: [Admin]
 *     summary: Đăng nhập admin
 *     description: Xác thực thông tin đăng nhập của admin.
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
 *                      description: The user's email.
 *                      example: mytran20110324@gmail.com
 *                  password:
 *                      type: string
 *                      description: The user's password.
 *                      example: My123456@
 *     responses:
 *       200:
 *         description: Đăng nhập thành công.
 *       401:
 *         description: Đăng nhập thất bại.
 */
router.post("/login/", adminController.loginAdmin);

module.exports = router;
