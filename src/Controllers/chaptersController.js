import { Timestamp, db } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import Chapters from "../models/Chapters.js";

class ChaptersController {
  // api/chapters/get
  async getChapters(req, res, next) {
    try {
      const chaptersRef = await db.collection("chapters").get();
      const listChapters = [];
      chaptersRef.docs.forEach((doc) => {
        const chapters = new Chapters(
          doc.id,
          doc.data().bookId,
          doc.data().chapterList,
          doc.data().create_at,
          doc.data().update_at
        );
        listChapters.push(chapters);
      });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get chapters successfully",
        responseData: listChapters,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get chapters failure",
        error: error.message,
      });
    }
  }
  // api/chapters/add
  async addChapters(req, res, next) {
    try {
      const bookId = req.body.bookId;
      const data = req.body;
      const book = await db.collection("book").doc(bookId).get();
      if (!book) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Add chapters failure",
          error: "Bad Request",
        });
      } else {
        const chapters = {
          bookId: bookId,
          chapterList: data.chapterList,
          create_at: Timestamp.now(),
          update_at: Timestamp.now(),
        };
        await db.collection("chapters").add(chapters);
        await db.collection("book").doc(bookId).update({ status: true });
        res.status(HttpStatusCode.INSERT_OK).json({
          status: STATUS.SUCCESS,
          message: "Add chapters successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.SUCCESS,
        message: "Add chapters failure",
        error: error.message,
      });
    }
  }
}

export default new ChaptersController();
