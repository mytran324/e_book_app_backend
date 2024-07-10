import { db, bucket, getDownloadURL, Timestamp } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import Audio from "../models/Audio.js";
import diacritic from "diacritic";

class AudioController {
  // api/audio
  async getAudios(req, res, next) {
    try {
      const audiosRef = await db.collection("audio").get();
      const listAudios = [];
      audiosRef.docs.forEach((doc) => {
        const audios = new Audio(
          doc.data().id,
          doc.data().bookId,
          doc.data().chapterList,
          doc.data().create_at,
          doc.data().update_at
        );
        listAudios.push(audios);
      });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get audios successfully",
        responseData: listAudios,
      });
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get audios failure",
        error: error.message,
      });
    }
  }
  // api/audio/add
  async addAudios(req, res, next) {
    try {
      const bookId = req.body.bookId;

      const data = req.files;
      const book = await db.collection("book").doc(bookId).get();

      let audioList = {};
      if (!book) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Add chapters failure",
          error: "Bad Request",
        });
      } else {
        const uploadFile = async (name, file, destinationArray) => {
          const folderName = diacritic.clean(book.data().title.split(" ").join(""));
          const fileName = `book_content_music/${folderName}/${Date.now()}_${
            file.originalname
          }`;
          const fileUpload = bucket.file(fileName);
          const blobStream = fileUpload.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });

          return new Promise((resolve, reject) => {
            blobStream.on("error", (error) => {
              console.error(error);
              reject(`Error uploading file: ${file.originalname}`);
            });

            blobStream.on("finish", async () => {
              const imageUrl = bucket.file(fileName);
              const downloadURL = await getDownloadURL(imageUrl);
              destinationArray[name] = downloadURL;
              resolve(`File ${file.originalname} uploaded successfully.`);
            });

            blobStream.end(file.buffer);
          });
        };
        const newAudios = {
          bookId: bookId,
          chapterList: audioList,
          create_at: Timestamp.now(),
          update_at: Timestamp.now(),
        }
        await db.collection("audio").add(newAudios);
        await db.collection("book").doc(bookId).update({ status: true });
        await Promise.all(
          data.map(async (item) => {
            await uploadFile(item.fieldname, item, audioList);
          })
        );
        res.status(HttpStatusCode.INSERT_OK).json({
          status: STATUS.SUCCESS,
          message: "Add Audios successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.SUCCESS,
        message: "Add audio failure",
        error: error.message,
      });
    }
  }
}

export default new AudioController();
