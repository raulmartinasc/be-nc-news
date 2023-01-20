const app = require("../db/app");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("NC-News", () => {
  describe("GET /api/topics", () => {
    test("It responds with an array of topics objects", () => {
      //arrange
      const output = [
        {
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        },
        {
          description: "Not dogs",
          slug: "cats",
        },
        {
          description: "what books are made of",
          slug: "paper",
        },
      ];
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toEqual(output);
          expect(res.body.topics).toBeInstanceOf(Array);
          expect(res.body.topics).toHaveLength(3);
        });
    });
    test("Each topic should have the correct keys", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const arrayOfTopics = res.body.topics;
          arrayOfTopics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test("It responds with an array of articles objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toHaveLength(12);
        });
    });
    test("Each article should have the correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const arrayOfArticles = res.body.articles;
          arrayOfArticles.forEach((article) => {
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
        });
    });
  });
  describe("GET /api/articles/queries", () => {
    test("Query Topic should filter articles by the topic value specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(11);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("Query sort_by sorts the articles by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted();
        });
    });
    test("Query order sorts the articles by any valid column in ASC order or DESC", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ descending: true });
        });
    });
  });
  describe("GET /api/users", () => {
    test("It responds with an array of objects with all the users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("It should respond with an article object by article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toBeInstanceOf(Object);
          expect(body.article.article_id).toBe(1);
        });
    });
    test("It should have the correct keys", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("author", expect.any(String));
          expect(body.article).toHaveProperty("title", expect.any(String));
          expect(body.article).toHaveProperty("article_id", expect.any(Number));
          expect(body.article).toHaveProperty("body", expect.any(String));
          expect(body.article).toHaveProperty("topic", expect.any(String));
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("votes", expect.any(Number));
          expect(body.article).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("It should respond with an array of comments ordered by date", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments).toHaveLength(11);
          const ArrayOfDates = body.comments.map((comment) => {
            return comment.created_at;
          });
          expect(ArrayOfDates).toBeSorted();
        });
    });
    test("It should respond with an empty array if the article exists but has no comments in it", () => {
      return request(app)
        .get("/api/articles/12/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("It should return the posted comment with the correct keys and values", () => {
      //arrange
      const newComment = { username: "rogersop", body: "Hello" };
      //act
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toBeInstanceOf(Object);
          expect(body.comment).toHaveProperty("article_id", expect.any(Number));
          expect(body.comment).toHaveProperty("created_at", expect.any(String));
          expect(body.comment).toHaveProperty("author", expect.any(String));
          expect(body.comment).toHaveProperty("comment_id", expect.any(Number));
          expect(body.comment).toHaveProperty("body", expect.any(String));
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("It should respond with the updated article with all the correct keys and values incrementing the votes counter", () => {
      //arrange
      const newVote = { inc_votes: 1 };
      const articleBeforeUpdate = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      //act
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(body.article.votes).toBe(101);
          // Properties and keys
          expect(body.article).toHaveProperty("article_id", expect.any(Number));
          expect(body.article).toHaveProperty("title", expect.any(String));
          expect(body.article).toHaveProperty("topic", expect.any(String));
          expect(body.article).toHaveProperty("author", expect.any(String));
          expect(body.article).toHaveProperty("body", expect.any(String));
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("votes", expect.any(Number));
          expect(body.article).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
        });
    });
    test("It should respond with the decremented counter when inc_votes is negative", () => {
      //arrange
      const newVote = { inc_votes: -50 };
      const articleBeforeUpdate = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      //act
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(body.article.votes).toBe(50);
        });
    });
  });
  // describe("DELETE /api/comments/:comment_id", () => {
  //   test("Should delete the given comment by comment_id and responds with no content", () => {
  //     request(app)
  //       .delete("api/comments/1")
  //       .expect(204)
  //       .then(({ body }) => {
  //         console.log(body);
  //       });
  //   });
  // });
  describe("Handling errors", () => {
    test("status:404-/notARoute, responds with an error message when the route does not exist", () => {
      return request(app)
        .get("/notARoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
    test("status:404-/api/articles/99999 responds with an error message when that Id does not exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("status 400 /api/articles/notAnID, responds with an error message when is an invalid Id", () => {
      return request(app)
        .get("/api/articles/notAnID")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("status 404 POST/api/articles/99999/comments responds with an error when that article Id does not exist", () => {
      const newComment = { username: "rogersop", body: "Hello" };
      return request(app)
        .post("/api/articles/99999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("status 400 POST/api/articles/1/comments responds with an error when is a malformed body or the user is missing required fields", () => {
      const newComment = {};
      return request(app)
        .post(`/api/articles/1/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("status 400 /api/articles/notAnId/comments responds with an error message when is an invalid Id", () => {
      return request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("status 404 /api/articles/9999/comments responds with an error article not found", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("status 404 PATCH/api/articles/9999 responds with an error when that article_id does not exist", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/9999")
        .send(newVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
    test("status 400 PATCH/api/articles/1 responds with an error when it is a malformed body or the user is missing required fields", () => {
      const newVote = {};
      const newVote2 = { inc_votes: "hello" };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
          // Incorrect data type
          return request(app)
            .patch("/api/articles/1")
            .send(newVote2)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
    });
    test("status 400 GET/api/articles/queries responds with an error when trying to do a sort_by query with a column that does not exist, preventing SQL injection", () => {
      return request(app)
        .get("/api/articles?sort_by=column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort query");
        });
    });
    test("status 400 GET/api/articles/queries responds with an error when trying to do a sort_by and order query with a order value that does not exist, preventing SQL injection", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=random")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
        });
    });
  });
});
