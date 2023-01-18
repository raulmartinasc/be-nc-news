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
