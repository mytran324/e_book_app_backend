import { Timestamp, db } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";
import Audio from "../models/Audio.js";

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
}

export default new AudioController();
