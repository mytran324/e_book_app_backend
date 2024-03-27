import { db } from "../configs/connectDB.js"; 
import Admin from "../models/Admin.js"; 
import createToken from "../middleware/createToken.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";

class AdminController {
  // api/admin/profile
  async getProfile(req, res, next) {
    try {
      const data = await db.collection("admin").doc(req.user.id).get();
      if (!data.exists) {
        res.status(400).json({ message: "fail", error: "Bad request" });
      } else {
        const admin = new Admin(
          data.id,
          data.data().fullName,
          data.data().email,
          data.data().passWord,
          data.data().status
        );
        res.status(HttpStatusCode.OK).json({ message: "success", data: admin });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // api/admin/login
  async loginAdmin(req, res, next) {
    try {
      const email = req.body.email;
      const passWord = req.body.password;

      const auth = await db
        .collection("admin")
        .where("email", "==", email)
        .get();

      if (auth.empty) {
        return res
          .status(400)
          .json({ message: "fail", error: "Email or password is incorrect" });
      }

      let admin;
      auth.forEach((doc) => {
        admin = new Admin(
          doc.id,
          doc.data().fullName,
          doc.data().email,
          doc.data().passWord,
          doc.data().status
        );
      });
      const passwordMatch = await db
        .collection("admin")
        .where("email", "==", email)
        .where("passWord", "==", passWord)
        .get();
      if (passwordMatch.empty) {
        return res
          .status(400)
          .json({ message: "fail", error: "Email or password is incorrect" });
      }

      let token = createToken(admin);
      res.status(200).json({
        message: "success",
        token: token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AdminController();