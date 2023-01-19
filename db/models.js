const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

exports.fetchAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then((result) => {
      const arrayOfArticles = result.rows;
      arrayOfArticles.forEach((article) => {
        convertTimestampToDate(article);
      });
      arrayOfArticles.forEach((article) => {
        Number(article["comment_count"]);
      });
      return arrayOfArticles;
    });
};

exports.selectArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return article;
      }
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id =$1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return db
          .query(
            "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at;",
            [article_id]
          )
          .then(({ rows }) => {
            const comment = rows[0];
            if (!comment) {
              return [];
            } else {
              return rows;
            }
          });
      }
    });
};

exports.postComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return db
          .query(
            `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
            [body, article_id, username]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};

exports.incrementVoteCount = (newVote, article_id) => {
  const { inc_votes } = newVote;
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return db
          .query(
            `UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *;`,
            [inc_votes, article_id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};
