const { db, auth } = require("../configs/connectDB");
const User = require("../models/User");

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
      res
        .status(200)
        .json({
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
}
module.exports = new UserController();
