import { Timestamp, db } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import ContactResponse from "../responses/contactResponse.js";
import User from "../models/User.js";

class ContactController {
  async getAllContact(req, res, next) {
    try {
      const contactRef = await db
        .collection("contact")
        .where("status", "==", true)
        .get();
      const listContact = [];
      for (const doc of contactRef.docs) {
        const userRef = await db.collection("users").doc(doc.data().uId).get();
        const user = new User(
          userRef.id,
          userRef.data().displayName,
          userRef.data().email,
          userRef.data().photoUrl,
          userRef.data().status,
          userRef.data().deviceToken,
          userRef.data().create_at,
          userRef.data().update_at
        );
        const contactResponse = new ContactResponse(
          doc.id,
          doc.data().content,
          doc.data().status,
          doc.data().type,
          user,
          doc.data().createdAt,
          doc.data().updateAt
        );
        listContact.push(contactResponse);
      }
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get all contact successfully",
        responseData: listContact,
      });
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all contact failure",
        error: e.message,
      });
      console.log(e);
    }
  }
  async updateContact(req, res, next) {
    try {
      const { id } = req.query;
      await db.collection("contact").doc(id).update({ status: false });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get update contact successfully",
      });
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all contact failure",
        error: e.message,
      });
    }
  }
}
export default new ContactController();
