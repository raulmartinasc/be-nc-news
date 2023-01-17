const topics = require("./data/test-data/topics");
const { fetchAllTopics } = require("./models");

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
