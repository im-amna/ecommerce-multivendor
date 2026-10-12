
const app = require("../app");
const connectDatabase = require("../db/Database");

module.exports = async (req, res) => {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return res.status(500).json({
      success: false,
      error: "Database connection failed",
      details: error.message,
    });
  }
};
