const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  sendArticlesById,
  sendCommentsByArticleId,
  addComment,
} = require("../db/controller");
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", sendArticlesById);
app.get("/api/articles/:article_id/comments", sendCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addComment);

// CUSTOM HANDLE ERROR
app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
//PSQL THROWN ERRORS
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});
// INTERNAL SERVER ERROR
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
