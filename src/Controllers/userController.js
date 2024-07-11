import { db, auth, Timestamp } from "../Configs/connectDB.js";
import User from "../models/User.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";

class UserController {
  async getAllUser(req, res, next) {
    try {
      const userRef = db.collection("users").where("status", '==', true);
      const data = await userRef.get();
      const userList = [];
      data.docs.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().displayName,
          doc.data().email,
          doc.data().photoUrl,
          doc.data().status,
          doc.data().deviceToken,
          doc.data().create_at,
          doc.data().update_at
        );
        userList.push(user);
      });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get all users successfully",
        responseData: userList,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all users failure",
        error: error.message,
      });
    }
  }

  async blockUser(req, res, next) {
    try {
      const { userId } = req.query;
      const user = await db.collection("users").doc(userId).get();
      if (!user) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Block user failure",
          error: "Bad request",
        });
      } else {
        auth.updateUser(userId, {
          disabled: true,
        });
        await db
          .collection("users")
          .doc(userId)
          .update({ status: false, update_at: Timestamp.now() });
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Block user successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Block user failure",
        error: error.message,
      });
    }
  }
  async deleteUnverifiedUsers() {
    try {
      const hourAgo = new Date();
      hourAgo.setHours(hourAgo.getHours() - 1);
      const listUsers = await auth.listUsers();
      listUsers.users.forEach(async (userRecord) => {
        const createtime = new Date(userRecord.metadata.creationTime);
        if (!userRecord.emailVerified && createtime < hourAgo) {
          await auth.deleteUser(userRecord.uid);
          console.log(`Đã xóa người dùng ${userRecord.uid}`);
        }
      });
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  }
}
export default new UserController();
