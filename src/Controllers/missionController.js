import { db, bucket, getDownloadURL, Timestamp } from "../Configs/connectDB.js";
import Mission from "../models/Mission.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";

class MissionController {
  // api/mission
  async getAllMissions(req, res, next) {
    try {
      const missionRef = db.collection("mission").where("status", "==", true);
      const data = await missionRef.get();
      const missionList = [];
      data.docs.forEach((doc) => {
        const mission = new Mission(
          doc.id,
          doc.data().coins,
          doc.data().detail,
          doc.data().name,
          doc.data().times,
          doc.data().type,
          doc.data().status,
          doc.data().create_at,
          doc.data().update_at
        );
        missionList.push(mission);
      });
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get all missions successfully",
        responseData: missionList,
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get all missions failure",
        error: error.message,
      });
    }
  }

  // api/mission/add
  async addMission(req, res, next) {
    try {
      const data = req.body;
      data.create_at = Timestamp.now();
      data.update_at = Timestamp.now();
      const newMission = await db.collection("mission").add(data);
      res.status(HttpStatusCode.INSERT_OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Add mission successfully",
        responseData: { id: newMission.id, ...data },
      });
    } catch (error) {
      res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.FAIL,
        message: "Add mission failure",
        error: error.message,
      });
    }
  }
  // api/mission/get
  async getMission(req, res, next) {
    try {
      const { missionId } = req.query;
      const missionRef = db.collection("mission").doc(missionId);
      const data = await missionRef.get();
      if (!data.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Get mission failure",
          error: "Bad request",
        });
      } else {
        const mission = new Mission(
          data.id,
          data.data().coins,
          data.data().detail,
          data.data().name,
          data.data().times,
          data.data().type,
          data.data().status,
          data.data().create_at,
          data.data().update_at
        );
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Get mission successfully",
          responseData: mission,
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get mission failure",
        error: error.message,
      });
    }
  }
  // api/mission/update
  async updateMission(req, res, next) {
    try {
      const { missionId } = req.query;
      const data = req.body;
      const mission = await db.collection("mission").doc(missionId).get();
      if (!mission.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Update mission failure",
          error: "Bad request",
        });
      } else {
        data.update_at = Timestamp.now();
        await db.collection("mission").doc(missionId).update(data);
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Update mission successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Update mission failure",
        error: error.message,
      });
    }
  }
  // api/mission/delete
  async deleteMission(req, res, next) {
    try {
      const { missionId } = req.query;
      const mission = await db.collection("mission").doc(missionId).get();
      if (!mission.exists) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          status: STATUS.FAIL,
          message: "Delete mission failure",
          error: "Bad request",
        });
      } else {
        const data = { status: false, update_at: Timestamp.now() };
        await db.collection("mission").doc(missionId).update(data);
        res.status(HttpStatusCode.OK).json({
          Headers: { "Content-Type": "application/json" },
          status: STATUS.SUCCESS,
          message: "Delete mission successfully",
        });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Delete mission failure",
        error: error.message,
      });
    }
  }
}

export default new MissionController();
