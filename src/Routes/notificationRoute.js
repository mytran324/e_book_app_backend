import { Router } from "express";
import notificationController from "../Controllers/notificationController.js";
const router = Router();
/**
 * @openapi
 * tags:
 *   name: Notification
 *   description: API for Notification operations
 */
/**
 * @openapi
 * /api/notification/sendAll:
 *   post:
 *     tags: [Notification]
 *     description: Send Notification
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: The notification's title.
 *                      example: Nhiệm vụ mới
 *                  body:
 *                      type: string
 *                      description: The notification's body.
 *                      example: Bạn có nhiệm vụ mới
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
router.post("/sendAll", notificationController.sendNotificationAll);
/**
 * @openapi
 * /api/notification/send:
 *   post:
 *     tags: [Notification]
 *     description: send information notification
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
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
 *                  title:
 *                      type: string
 *                      description: The notification's title.
 *                      example: test
 *                  body: 
 *                      type: string
 *                      description: The notification's body
 *                      example: test
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
router.post("/send/", notificationController.sendNotification);
export default router;
