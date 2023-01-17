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
  // describe("GET /api/articles", () => {
  //   test("It responds with an array of articles objects", () => {
  //     return request(app)
  //       .get("/api/articles")
  //       .expect(200)
  //       .then((res) => {
  //         expect(res.body.articles).toHaveLength(12);
  //       });
  //   });
  // });
  describe("Handling errors", () => {
    test("status:404, responds with an error message when the route does not exist", () => {
      return request(app)
        .get("/notARoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
});
