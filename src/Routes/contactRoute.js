import { Router } from "express";
import contactController from "../Controllers/contactController.js";

const router = Router();
/**
 * @openapi
 * tags:
 *   name: Contact
 *   description: API for Contact operations
 */
/**
 * @openapi
 * /api/contact:
 *   get:
 *     tags: [Contact]
 *     description: get all Contact
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
router.get("/", contactController.getAllContact);
/**
 * @openapi
 * /api/contact/update:
 *   put:
 *     tags: [Contact]
 *     description: update status contact
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
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
router.put("/update/", contactController.updateContact);
export default router;
