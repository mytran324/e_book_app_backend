import { db } from "../Configs/connectDB.js";
import Admin from "../models/Admin.js";
import createToken from "../middleware/createToken.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
class AdminController {
  // api/admin/profile
  async getProfile(req, res, next) {
    try {
      const data = await db.collection("admin").doc(req.user.id).get();
      if (!data.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Get profile admin failure",
          error: "Bad request",
        });
      } else {
        const admin = new Admin(
          data.id,
          data.data().fullName,
          data.data().email,
          data.data().passWord,
          data.data().status
        );
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Get profile admin successfully",
          responseData: admin,
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get profile admin failure",
        error: error.message,
      });
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
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Login failure",
          error: Exception.WRONG_EMAIL_OR_PASSWORD,
        });
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
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Login failure",
          error: Exception.WRONG_EMAIL_OR_PASSWORD,
        });
      }

      let token = createToken(admin);
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Login successfully",
        responseData: { token: token },
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Login failure",
        error: error.message,
      });
    }
  }

  // api/admin/checkToken
  async checkToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.json(false);
    }

    // Extract and verify the token
    jwt.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET_KEY,
      (err, decoded) => {
        if (err) {
          return res.json(false);
        }

        return res.json(true);
      }
    );
  }
}

export default new AdminController();
