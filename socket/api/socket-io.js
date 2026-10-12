
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Socket deployment endpoint is working!",
  });
});

module.exports = app;