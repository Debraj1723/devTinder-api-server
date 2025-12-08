const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");

cron.schedule("17 1 * * *", async () => {
  try {
    // Start of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Start of yesterday
    const start = new Date(todayStart);
    start.setDate(start.getDate() - 1);

    // End of yesterday
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    // Correct Mongo filter
    const yesterdaysRequest = await ConnectionRequest.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
      status: "Interested",
    })
      .populate("fromUserID")
      .populate("toUserID");

    yesterdaysRequest.forEach((e) => {
      console.log(`Request from ${e.fromUserID.firstName} to ${e.toUserID.firstName}`);
    });

  } catch (err) {
    console.log("Cronjob failed", err);
  }
});
