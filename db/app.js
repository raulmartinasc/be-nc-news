const express = require("express");
const app = express();
const { getTopics } = require("../db/controller");

app.get("/api/topics", getTopics);

// CUSTOM HANDLE ERROR
app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});
// INTERNAL SERVER ERROR
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
