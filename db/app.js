const express = require("express");
const app = express();
const cors = require("cors");
const {
  getAllPaths,
  getTopics,
  getArticles,
  getUsers,
  sendArticlesById,
  sendCommentsByArticleId,
  addComment,
  deleteComment,
  addVote,
} = require("../db/controller");
app.use(cors());
app.use(express.json());
app.get("/api", getAllPaths);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", sendArticlesById);
app.get("/api/articles/:article_id/comments", sendCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addComment);
app.patch("/api/articles/:article_id/", addVote);
app.delete("/api/comments/:comment_id", deleteComment);

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
  if (err.code === "22P02" || err.code === "23502") {
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
