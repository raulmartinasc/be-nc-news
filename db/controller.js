const topics = require("./data/test-data/topics");
const endPoints = require("../endpoints.json");
const {
  fetchAllTopics,
  fetchAllArticles,
  fetchAllUsers,
  selectArticlesById,
  selectCommentsByArticleId,
  postComment,
  deleteCommentById,
  incrementVoteCount,
} = require("./models");

exports.getAllPaths = (req, res, next) => {
  res.status(200).send(endPoints);
};

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  fetchAllArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.sendArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  postComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.addVote = (req, res, next) => {
  const newVote = req.body;
  const { article_id } = req.params;
  incrementVoteCount(newVote, article_id)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then((comment) => {
      res.status(204).send({ comment });
    })
    .catch(next);
};
