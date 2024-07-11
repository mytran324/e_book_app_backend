import { Timestamp, db } from "../Configs/connectDB.js";
import HttpStatusCode from "../Exception/HttpStatusCode.js";
import { STATUS } from "../Global/Constants.js";

class StatisticController {
  // api/statistic
  async getStatistic(req, res, next) {
    try {
      // get users
      const totalUsers = await db.collection("users").count().get();
      // get views
      let bookReadViews = 0;
      let bookListenViews = 0;
      const bookReadViewSnapshot = await db.collection("histories").get();
      bookReadViews = bookReadViewSnapshot.docs.reduce(
        (sum, item) => sum + item.data().times,
        0
      );
      const bookListenViewSnapshot = await db
        .collection("histories_audio")
        .get();
      bookListenViews = bookListenViewSnapshot.docs.reduce(
        (sum, item) => sum + item.data().times,
        0
      );
      // get books
      const totalBooks = await db.collection("book").count().get();
      // get missions
      const totalMissions = await db.collection("mission").count().get();
      // get revenue
      let totalRevenues = 0;
      const totalRevenuesSnapshot = await db.collection("deposit").get();
      totalRevenues = totalRevenuesSnapshot.docs.reduce(
        (sum, item) => sum + item.data().money,
        0
      );
      // get revenue by month
      const currentYear = new Date().getFullYear();
      const revenueByMonth = {};
      for (let i = 1; i <= 12; i++) {
        let sum = 0;
        totalRevenuesSnapshot.docs.forEach((doc) => {
          const createDate = doc.data().createdAt.toDate(); // Assuming create_at is a Firestore timestamp
          if (
            createDate.getMonth() + 1 === i &&
            createDate.getFullYear() === currentYear
          ) {
            sum += doc.data().money;
          }
        });
        revenueByMonth[i] = sum;
      }

      const statisticData = {
        totalUsers: totalUsers.data().count,
        totalViews: bookReadViews + bookListenViews,
        totalBooks: totalBooks.data().count,
        totalMissions: totalMissions.data().count,
        totalRevenues: totalRevenues,
        revenueByMonth: revenueByMonth,
      };
      res.status(HttpStatusCode.OK).json({
        Headers: { "Content-Type": "application/json" },
        status: STATUS.SUCCESS,
        message: "Get statistic successfully",
        responseData: statisticData,
      });
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: STATUS.FAIL,
        message: "Get statistic failure",
        error: e,
      });
      console.log(e);
    }
  }
}

export default new StatisticController();
