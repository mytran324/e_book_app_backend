import { db, bucket, getDownloadURL, Timestamp } from "../Configs/connectDB.js";
import Book from "../models/Book.js";
import Category from "../models/Category.js";
import Author from "../models/Author.js";
import BookResponse from "../responses/bookResponse.js";
import diacritic from "diacritic";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import Chapters from "../models/Chapters.js";
import Audio from "../models/Audio.js";
import BookDetailResponse from "../responses/bookDetailResponse.js";

class BookController {
  // api/book
  async getAllBook(req, res, next) {
    try {
      const { currentPage } = req.query;
      const totalBook = await db.collection("book").count().get();
      const bookRef = db
        .collection("book")
        .offset((currentPage - 1) * 5)
        .limit(5);
      const data = await bookRef.get();
      const bookList = [];

      for (const doc of data.docs) {
        // Get author
        const authorRef = db.collection("author").doc(doc.data().authodId);
        const authorData = await authorRef.get();
        const author = new Author(
          authorData.id,
          authorData.data().fullName,
          authorData.data().status,
          authorData.data().create_at,
          authorData.data().update_at
        );
        const bookResponse = new BookResponse(
          doc.id,
          author,
          doc.data().price,
          doc.data().title,
          doc.data().create_at,
          doc.data().update_at
        );

        bookList.push(bookResponse);
      }

      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get all books successfully",
        responseData: { data: bookList, totalBook: totalBook.data().count },
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all books failure",
        error: error.message,
      });
    }
  }

  // api/book/add
  async addBook(req, res, next) {
    try {
      const data = req.body;
      const bookReviewReq = req.files["bookReview"];
      const imageUrlReq = req.files["imageUrl"];
      const bookReview = [];
      const imageUrlBook = [];

      const folderName = diacritic.clean(data.title.split(" ").join(""));

      if (
        !bookReviewReq ||
        bookReviewReq.length === 0 ||
        !imageUrlReq ||
        imageUrlReq.length === 0
      ) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Add book failure",
          error: "Both image fields are required.",
        });
      }

      const uploadFile = async (file, destinationArray) => {
        const promises = file.map(async (item) => {
          const fileName = `book_content_images/${folderName}/${Date.now()}_${
            item.originalname
          }`;
          const fileUpload = bucket.file(fileName);
          const blobStream = fileUpload.createWriteStream({
            metadata: {
              contentType: item.mimetype,
            },
          });

          return new Promise((resolve, reject) => {
            blobStream.on("error", (error) => {
              console.error(error);
              reject(`Error uploading file: ${item.originalname}`);
            });

            blobStream.on("finish", async () => {
              const imageUrl = bucket.file(fileName);
              const downloadURL = await getDownloadURL(imageUrl);
              destinationArray.push(downloadURL);
              resolve(`File ${item.originalname} uploaded successfully.`);
            });

            blobStream.end(item.buffer);
          });
        });

        await Promise.all(promises);
      };

      await Promise.all([
        uploadFile(bookReviewReq, bookReview),
        uploadFile(imageUrlReq, imageUrlBook),
      ]);
      const timestampValue = Timestamp.now();
      const author = data.authodId;
      let authorId;
      const authorRef = await db
        .collection("author")
        .where("fullName", "==", author)
        .get();
      if (authorRef.empty) {
        const newAuthor = await db
          .collection("author")
          .add({ fullName: author, status: true });
        authorId = newAuthor.id;
      } else {
        authorRef.forEach((doc) => (authorId = doc.id));
      }
      const book = {
        authodId: authorId,
        bookPreview: bookReview,
        categoryId: data.categoryId.split(","),
        chapters: parseInt(data.chapters, 10),
        country: data.country,
        description: data.description,
        imageUrl: imageUrlBook[0],
        language: data.language,
        price: 0,
        publishDate: timestampValue,
        status: false,
        title: data.title,
        create_at: Timestamp.now(),
        update_at: Timestamp.now(),
      };
      const newBook = await db.collection("book").add(book);

      res.status(HttpStatusCode.INSERT_OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Add book successfully",
        responseData: { id: newBook.id, ...book },
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Add book failure",
        error: error.message,
      });
    }
  }

  // api/book/get
  async getBook(req, res, next) {
    try {
      const { bookId } = req.query;
      const bookRef = db.collection("book").doc(bookId);
      const data = await bookRef.get();
      if (!data.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Get book failure",
          error: "Bad request",
        });
      } else {
        const authorRef = db.collection("author").doc(data.data().authodId);
        const authorData = await authorRef.get();
        const author = new Author(
          authorData.id,
          authorData.data().fullName,
          authorData.data().status,
          authorData.data().create_at,
          authorData.data().update_at
        );

        // Get category
        const categoryList = [];
        for (const cate of data.data().categoryId) {
          const categoryRef = db.collection("category").doc(cate);
          const categoryData = await categoryRef.get();
          const category = new Category(
            categoryData.id,
            categoryData.data().name,
            categoryData.data().status,
            categoryData.data().imageUrl,
            categoryData.data().create_at,
            categoryData.data().update_at
          );
          categoryList.push(category);
        }

        // Get list of chapters
        let chapters = [];
        const chaptersRef = await db
          .collection("chapters")
          .where("bookId", "==", bookId)
          .get();
        if (!chaptersRef.empty) {
          chaptersRef.docs.forEach((chapterDoc) => {
            chapters.push(
              new Chapters(
                chapterDoc.id,
                chapterDoc.data().bookId,
                chapterDoc.data().chapterList,
                chapterDoc.data().create_at,
                chapterDoc.data().update_at
              )
            );
          });
        }

        // Get list of audios
        let audios = [];
        const audiosRef = await db
          .collection("audio")
          .where("bookId", "==", bookId)
          .get();
        if (!audiosRef.empty) {
          audiosRef.docs.forEach((audioDoc) => {
            audios.push(
              new Audio(
                audioDoc.id,
                audioDoc.data().bookId,
                audioDoc.data().audioList,
                audioDoc.data().create_at,
                audioDoc.data().update_at
              )
            );
          });
        }

        const bookDetailResponse = new BookDetailResponse(
          bookId,
          author,
          categoryList,
          data.data().description,
          data.data().imageUrl,
          data.data().language,
          data.data().price,
          data.data().publishDate,
          data.data().status,
          data.data().title,
          data.data().bookPreview,
          data.data().chapters,
          data.data().country,
          chapters,
          audios,
          data.data().create_at,
          data.data().update_at
        );
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Get book detail successfully",
          responseData: bookDetailResponse,
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get book detail failure",
        error: error.message,
      });
    }
  }

  // api/book/update
  async updateBook(req, res, next) {
    try {
      const { bookId } = req.query;
      const data = req.body;
      const bookReview = [];
      const image = [];
      const keys = Object.keys(req.body);
      if (keys.includes("status")) {
        if (data.status === "false") {
          data.status = false;
        } else {
          data.status = true;
        }
      }
      const uploadFile = async (file, destinationArray) => {
        const promises = file.map(async (item) => {
          const fileName = `book_content_images/${folderName}/${Date.now()}_${
            item.originalname
          }`;
          const fileUpload = bucket.file(fileName);
          const blobStream = fileUpload.createWriteStream({
            metadata: {
              contentType: item.mimetype,
            },
          });

          return new Promise((resolve, reject) => {
            blobStream.on("error", (error) => {
              console.error(error);
              reject(`Error uploading file: ${item.originalname}`);
            });

            blobStream.on("finish", async () => {
              const imageUrl = bucket.file(fileName);
              const downloadURL = await getDownloadURL(imageUrl);
              destinationArray.push(downloadURL);
              resolve(`File ${item.originalname} uploaded successfully.`);
            });

            blobStream.end(item.buffer);
          });
        });
        await Promise.all(promises);
      };

      const bookRef = await db.collection("book").doc(bookId);
      const book = await bookRef.get();
      if (!book.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Update book failure",
          error: "Bad request",
        });
      } else {
      }
    } catch (error) {}
  }

  // api/book/delete
  async deleteBook(req, res, next) {
    try {
      const { bookId } = req.query;
      const book = await db.collection("book").doc(bookId).get();
      if (!book.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Delete book failure",
          error: "Bad request",
        });
      } else {
        const data = {
          status: false,
          update_at: Timestamp.now(),
        };
        await db.collection("book").doc(bookId).update(data);
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Delete book successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Delete book failure",
        error: error.message,
      });
    }
  }

  // api/book/remove
  async removeBook(req, res, next) {
    try {
      const { bookId } = req.query;
      const book = await db.collection("book").doc(bookId).get();
      if (!book.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Remove book failure",
          error: "Bad request",
        });
      } else {
        await db.collection("book").doc(bookId).delete();
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Remove book successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Remove book failure",
        error: error.message,
      });
    }
  }
  // api/book/topBook
  async viewBooks(req, res, next) {
    try {
      const booksSnapshot = await db.collection("book").get();
      const bookViews = [];

      for (const bookDoc of booksSnapshot.docs) {
        const bookViewSnapshot = await db
          .collection("histories")
          .where("chapters", "==", bookDoc.id)
          .get();
        const bookView = {
          bookId: bookDoc.id,
          views: bookViewSnapshot.docs.reduce(
            (sum, item) => sum + item.data().times,
            0
          ),
        };
        bookViews.push(bookView);
      }
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get view books successfully",
        responseData: bookViews,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get view books failure",
        error: error.message,
      });
    }
  }

  // api/book/totalView
  async totalViews(req, res, next) {
    try {
      const histories = await db.collection("histories").get();
      console.log(histories);
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get total views successfully",
        responseData: { totalViews: histories.size },
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get total views failure",
        error: error.message,
      });
    }
  }
}

export default new BookController();
