
const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  return mongoose.connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = connectDatabase;
