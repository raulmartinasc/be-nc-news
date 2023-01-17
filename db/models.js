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
      result.rows.forEach((article) => {
        convertTimestampToDate(article);
      });
      return arrayOfArticles;
    });
};
