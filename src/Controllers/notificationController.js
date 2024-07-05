import { db, auth, Timestamp } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import firebaseAdmin from "firebase-admin";

class NotificationController {
  // api/notification/sendAll
  async sendNotificationAll(req, res, next) {
    try {
      const { title, body } = req.body;
      const userRef = await db.collection("users");
      const data = await userRef.get();
      let registrationTokens = [];
      data.docs.forEach((doc) => {
        registrationTokens.push(doc.data().deviceToken);
      });
      registrationTokens = registrationTokens.filter(
        (token) => token !== null && token !== undefined && token !== ""
      );
      const messages = {
        tokens: registrationTokens,
        notification: {
          title: title,
          body: body,
        },
      };
      firebaseAdmin
        .messaging()
        .sendEachForMulticast(messages)
        .then((response) => {
          res.status(HttpStatusCode.OK).json({
            status: STATUS.SUCCESS,
            message: "Notifications sent successfully",
          });
        })
        .catch((error) => {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAIL,
            message: "Error sending notifications",
          });
        });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: STATUS.FAIL, message: "Error sending notifications" });
    }
  }

  // api/notification/send/
  async sendNotification(req, res, next) {
    try {
      const { userId } = req.query;
      const { title, body } = req.body;
      const user = await db.collection("users").doc(userId).get();
      if (!user) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Error sending notifications",
        });
      } else {
        let registrationToken = [];
        registrationToken.push(user.data().deviceToken);
        const message = {
          tokens: registrationToken,
          notification: {
            title: title,
            body: body,
          },
        };
        firebaseAdmin
          .messaging()
          .sendEachForMulticast(message)
          .then((response) => {
            res.status(HttpStatusCode.OK).json({
              status: STATUS.SUCCESS,
              message: "Notifications sent successfully",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
              status: STATUS.FAIL,
              message: "Error sending notifications",
            });
          });
      }
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Error sending notifications",
      });
    }
  }
}

export default new NotificationController();
