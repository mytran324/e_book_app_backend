import { db, bucket, getDownloadURL, Timestamp } from "../Configs/connectDB.js";
import Category from "../models/Category.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";

class CategoryController {
  // api/category
  async getAllCategory(req, res, next) {
    try {
      const categoryRef = db.collection("category").where("status", "==", true);
      const data = await categoryRef.get();
      const categoryList = [];
      data.docs.forEach((doc) => {
        const category = new Category(
          doc.id,
          doc.data().name,
          doc.data().status,
          doc.data().imageUrl,
          doc.data().create_at,
          doc.data().update_at
        );
        categoryList.push(category);
      });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get all category successfully",
        responseData: categoryList,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all category failure",
        error: error.message,
      });
    }
  }

  //api/category/add
  async addCategory(req, res, next) {
    try {
      const data = req.body;
      const imageUrlReq = req.file;
      const uploadFile = async (file, destinationArray) => {
        return new Promise((resolve, reject) => {
          const fileName = `${file.originalname}`;
          const fileUpload = bucket.file(fileName);
          const blobStream = fileUpload.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });

          blobStream.on("error", (error) => {
            console.error(error);
            reject(`Error uploading file: ${file.originalname}`);
          });

          blobStream.on("finish", async () => {
            const imageUrl = bucket.file(fileName);
            const downloadURL = await getDownloadURL(imageUrl);
            destinationArray.push(downloadURL);
            resolve();
          });

          blobStream.end(file.buffer);
        });
      };

      const imageUrl = [];
      const keys = Object.keys(req.body);
      if (keys.includes("status")) {
        if (data.status === "false") {
          data.status = false;
        } else {
          data.status = true;
        }
      }
      await uploadFile(imageUrlReq, imageUrl);
      const category = {
        imageUrl: imageUrl[0],
        name: data.name,
        status: data.status,
        create_at: Timestamp.now(),
        update_at: Timestamp.now(),
      };
      const newCategory = await db.collection("category").add(category);
      res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.SUCCESS,
        message: "Add category successfully",
        responseData: { id: newCategory.id, ...category },
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Add category failure",
        error: error.message,
      });
    }
  }

  // api/category/get
  async getCategory(req, res, next) {
    try {
      const { categoryId } = req.query;
      const categoryRef = db.collection("category").doc(categoryId);
      const data = await categoryRef.get();
      if (!data.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Get category failure",
          error: "Bad request",
        });
      } else {
        const category = new Category(
          data.id,
          data.data().name,
          data.data().status,
          data.data().imageUrl,
          data.data().create_at,
          data.data().update_at
        );
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Get category successfully",
          responseData: category,
        });
      }
    } catch (error) {
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { categoryId } = req.query;
      const data = req.body;
      const categoryRef = await db.collection("category").doc(categoryId);
      const category = await categoryRef.get();
      const keys = Object.keys(req.body);
      if (keys.includes("status")) {
        if (data.status === "false") {
          data.status = false;
        } else {
          data.status = true;
        }
      }
      if (!category.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Update category failure",
          error: "Bad request",
        });
      } else {
        if (req.file) {
          await new Promise((resolve, reject) => {
            const fileName = `${req.file.originalname}`;
            const fileUpload = bucket.file(fileName);
            const blobStream = fileUpload.createWriteStream({
              metadata: {
                contentType: req.file.mimetype,
              },
            });

            blobStream.on("error", (error) => {
              console.error(error);
              reject(`Error uploading file: ${req.file.originalname}`);
            });

            blobStream.on("finish", async () => {
              const imageUrl = bucket.file(fileName);
              const downloadURL = await getDownloadURL(imageUrl);
              data.imageUrl = downloadURL;
              resolve();
            });
            blobStream.end(req.file.buffer);
          });
        }
        data.update_at = Timestamp.now();
        await db.collection("category").doc(categoryId).update(data);
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Update category successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Update category failure",
        error: error.message,
      });
      console.log(error);
    }
  }

  // api/category/delete
  async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.query;
      const categoryRef = await db.collection("category").doc(categoryId);
      const category = await categoryRef.get();
      if (!category.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Delete category failure",
          error: "Bad request",
        });
      } else {
        const bookRef = await db
          .collection("book")
          .where("categoryId", "array-contains", category.id)
          .get();
        await db
          .collection("category")
          .doc(categoryId)
          .update({ status: false, update_at: Timestamp.now() });
        for (const doc of bookRef.docs) {
          await db.collection("book").doc(doc.id).update({ status: false });
        }
        res.status(HttpStatusCode.OK).json({
          status: STATUS.SUCCESS,
          message: "Delete category successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Delete category failure",
        error: error.message,
      });
    }
  }
}

export default new CategoryController();
