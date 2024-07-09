import { Timestamp, db } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";


class StatisticController {
    async getStatistic (req, res, next) {
        const totalUsers = await db.collection("users").count().get();
        const totalViews = await db.collection("histories");
    }
}

export default new StatisticController();