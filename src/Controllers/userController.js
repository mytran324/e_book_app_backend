import { db, auth, Timestamp } from "../Configs/connectDB.js";
import User from "../models/User.js";

class UserController {
  async getAllUser(req, res, next) {
    try {
      const userRef = await db.collection("user");
      const data = await userRef.get();
      const userList = [];
      data.docs.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().fullName,
          doc.data().email,
          doc.data().imageUrl,
          doc.data().passWord,
          doc.data().phoneNumber,
          doc.data().provider,
          doc.data().status
        );
        userList.push(user);
      });
      res.status(200).json({
        Headers: { "Content-Type": "application/json" },
        message: "success",
        data: userList,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", error: error.message });
    }
  }

  async blockUser(req, res, next) {
    try {
      const { userId } = req.query;
      const user = await db.collection("user").doc(userId).get();
      if (!user) {
        res.status(400).json({ message: "fail", error: "Bad request" });
      } else {
        auth.updateUser(userId, {
          disabled: true,
        });
        await db.collection("user").doc(userId).update({ status: false });
        res.status(200).json({ message: "success" });
      }
    } catch (error) {
      res.status(500).json({ message: "fail", error: error.message });
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
