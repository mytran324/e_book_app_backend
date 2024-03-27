const { db } = require("../configs/connectDB");
const Author = require("../models/Author");

class AuthorController {
  // api/author (get all)
  async getAllAuthor(req, res, next) {
    try {
      const authorRef = await db.collection("author");
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
      res
        .status(200)
        .json({
          Headers: { "Content-Type": "application/json" },
          message: "success",
          data: authorList,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // api/author/add
  async addAuthor(req, res, next) {
    try {
      const data = req.body;
      const newAuthor = await db.collection("author").add(data);
      res
        .status(201)
        .json({ message: "success", data: { id: newAuthor.id, ...data } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // api/author/get
  async getAuthor(req, res, next) {
    try {
      const { authorId } = req.query;
      const authorRef = await db.collection("author").doc(authorId);
      const data = await authorRef.get();
      if (!data.exists) {
        res.status(400).json({ message: "fail", error: "Bad request" });
      } else {
        const author = new Author(
          data.id,
          data.data().fullName,
          data.data().status
        );
        res.status(200).json({ message: "success", data: author });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // api/author/update

  async updateAuthor(req, res, next) {
    try {
      const { authorId } = req.query;
      const data = req.body;
      const author = await db.collection("author").doc(authorId).get();
      if (!author.exists) {
        res.status(400).json({ error: "Bad request" });
      } else {
        await db.collection("author").doc(authorId).update(data);
        res.status(200).json({ message: "success" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // api/author/delete

  async deleteAuthor(req, res, next) {
    try {
      const { authorId } = req.query;
      console.log(authorId);
      const author = await db.collection("author").doc(authorId).get();
      if (!author.exists) {
        res.status(400).json({ error: "Bad request" });
      } else {
        const data = { status: false };
        await db.collection("author").doc(authorId).update(data);
        res.status(200).json({ message: "success" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthorController();
