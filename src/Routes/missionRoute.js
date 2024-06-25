import { Router } from "express";
import missionController from "../Controllers/missionController.js";
const router = Router();
/**
 * @openapi
 * tags:
 *  name: Mission
 *  description: API for Mission operations
 */
/**
 * @openapi
 * /api/mission:
 *   get:
 *     tags: [Mission]
 *     description: Get list missions
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
router.get("/", missionController.getAllMissions);
/**
 * @openapi
 * /api/mission/get:
 *   get:
 *     tags: [Mission]
 *     description: Get information Mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: missionId
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
router.get("/get/", missionController.getMission);
/**
 * @openapi
 * /api/mission/add:
 *   post:
 *     tags: [Mission]
 *     description: Add missions
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  coins:
 *                      type: number
 *                      description: The mission's coins.
 *                      example: 10
 *                  detail:
 *                      type: string
 *                      description: The mission's detail.
 *                      example: test
 *                  name:
 *                      type: string
 *                      description: The mission's name.
 *                      example: test
 *                  times:
 *                      type: number
 *                      description: The mission's times.
 *                      example: test
 *                  type:
 *                      type: String
 *                      description: The mission's type.
 *                      example: test
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
router.post("/add/", missionController.addMission);
/**
 * @openapi
 * /api/mission/update:
 *   put:
 *     tags: [Mission]
 *     description: update information mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: missionId
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
 *                  coins:
 *                      type: number
 *                      description: The mission's coins.
 *                      example: 10
 *                  detail:
 *                      type: string
 *                      description: The mission's detail.
 *                      example: test
 *                  name:
 *                      type: string
 *                      description: The mission's name.
 *                      example: test
 *                  times:
 *                      type: number
 *                      description: The mission's times.
 *                      example: 3
 *                  type:
 *                      type: string
 *                      description: The mission's type.
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
router.put("/update/", missionController.updateMission);
/**
 * @openapi
 * /api/mission/delete:
 *   delete:
 *     tags: [Mission]
 *     description: Delete mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: missionId
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
router.delete("/delete/", missionController.deleteMission); 
export default router;
