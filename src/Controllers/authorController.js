import { db } from "../Configs/connectDB.js";
import Author from "../models/Author.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";

class AuthorController {
  // api/author (get all)
  async getAllAuthor(req, res, next) {
    try {
      const authorRef = db.collection("author");
      const data = await authorRef.get();
      const authorList = [];
      data.docs.forEach((doc) => {
        const author = new Author(
          doc.id,
          doc.data().fullName,
          doc.data().status
        );
        authorList.push(author);
      });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get all author successfully",
        responseData: authorList,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all author failure",
        error: error.message,
      });
    }
  }
  // api/author/add
  async addAuthor(req, res, next) {
    try {
      const data = req.body;
      const newAuthor = await db.collection("author").add(data);
      res.status(HttpStatusCode.INSERT_OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Add author successfully",
        responseData: { id: newAuthor.id, ...data },
      });
    } catch (error) {
      res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.FAIL,
        message: "Add author failure",
        error: error.message,
      });
    }
  }
  // api/author/get
  async getAuthor(req, res, next) {
    try {
      const { authorId } = req.query;
      const authorRef = db.collection("author").doc(authorId);
      const data = await authorRef.get();
      if (!data.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Get author failure",
          error: "Bad request",
        });
      } else {
        const author = new Author(
          data.id,
          data.data().fullName,
          data.data().status
        );
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Get author successfully",
          responseData: author,
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get author failure",
        error: error.message,
      });
    }
  }

  // api/author/update

  async updateAuthor(req, res, next) {
    try {
      const { authorId } = req.query;
      const data = req.body;
      const author = await db.collection("author").doc(authorId).get();
      if (!author.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Update author failure",
          error: "Bad request",
        });
      } else {
        await db.collection("author").doc(authorId).update(data);
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Update author successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Update author successfully",
        error: error.message,
      });
    }
  }

  // api/author/delete

  async deleteAuthor(req, res, next) {
    try {
      const { authorId } = req.query;
      console.log(authorId);
      const author = await db.collection("author").doc(authorId).get();
      if (!author.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Delete author failure",
          error: "Bad request",
        });
      } else {
        const data = { status: false };
        await db.collection("author").doc(authorId).update(data);
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Delete author successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Delete author failure",
        error: error.message,
      });
    }
  }
}

export default new AuthorController();
