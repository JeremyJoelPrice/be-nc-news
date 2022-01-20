const database = require("../database/connection.js");
const testData = require("../database/data/test-data/index.js");
const seed = require("../database/seeds/seed.js");
const app = require("../server/app.js");
const supertest = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => database.end());
describe("/api", () => {
	describe("GET", () => {
		test("200 status and returns JSON of all avialable endpoints", async () => {
			const { status, body } = await supertest(app).get("/api");
			expect(status).toBe(200);
			expect(body.message).toEqual({
				"GET /api": {
					"description":
						"serves up a json representation of all the available endpoints of the api"
				},
				"GET /api/topics": {
					"description": "serves an array of all topics",
					"queries": [],
					"exampleResponse": [{ "slug": "football", "description": "Footie!" }]
				},
				"GET /api/articles": {
					"description": "serves an array of all articles",
					"queries": ["order", "sort_by", "topic"],
					"exampleResponse": [
						{
							"title": "Seafood substitutions are increasing",
							"article_id": 9,
							"topic": "cooking",
							"author": "weegembump",
							"created_at": "2020-07-09T21:11:00.000Z",
							"comment_count": 12
						}
					]
				},
				"GET /api/articles/:article_id": {
					"description": "serves the article specified by the given article_id",
					"queries": [],
					"exampleResponse": {
						"article_id": 1,
						"title": "Living in the shadow of a great man",
						"body": "I find this existence challenging",
						"votes": 100,
						"topic": "mitch",
						"author": "butter_bridge",
						"created_at": "2020-07-09T21:11:00.000Z",
						"comment_count": 11
					}
				},
				"PATCH /api/articles/:article_id": {
					"description":
						"edits the vote count of, and serves, the article specified by the given article_id",
					"queries": [],
					"validBody": {
						"inc_votes": 1
					},
					"exampleResponse": {
						"article_id": 1,
						"title": "Living in the shadow of a great man",
						"body": "I find this existence challenging",
						"votes": 1000,
						"topic": "mitch",
						"author": "butter_bridge",
						"created_at": "2020-07-09T21:11:00.000Z",
						"comment_count": 11
					}
				},
				"GET /api/articles/:article_id/comments" : {
					"description": "serves an array of all comments made on the given article_id",
					"queries": [],
					"exampleResponse": [
						{
							"body": 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
							"votes": -1,
							"author": 'tickle122',
							"article_id": 18,
							"created_at": "2020-07-09T21:11:00.000Z",
						}
					]
				},
				"POST /api/articles/:article_id/comments" : {
					"description": "post, and serves, a new comment on the given article_id",
					"queries": [],
					"validBody": {
						"username": "mitch",
						"body": "this is my comment"
					},
					"exampleResponse": {
						"body": 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
						"votes": -1,
						"author": 'tickle122',
						"article_id": 18,
						"created_at": "2020-07-09T21:11:00.000Z",
					}
				},
				"DELETE /api/comments/:comment_id": {
					"description": "Deletes the comment specified by comment_id",
					"queries": [],
					"exampleResponse": {}
				}
			});
		});
	});
});

describe("/api/topics", () => {
	describe("GET", () => {
		test("200 status and returns an array of topics", async () => {
			const { status, body } = await supertest(app).get("/api/topics");
			expect(status).toBe(200);
			expect(Array.isArray(body)).toBe(true);
			body.forEach((topic) => {
				expect(topic).toEqual(
					expect.objectContaining({
						slug: expect.any(String),
						description: expect.any(String)
					})
				);
			});
		});
	});
});

describe("/api/articles", () => {
	describe("GET", () => {
		test("200 status and returns an array of articles", async () => {
			const { status, body } = await supertest(app).get("/api/articles");
			expect(status).toBe(200);
			expect(Array.isArray(body)).toBe(true);
			body.forEach((article) => {
				expect(article).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: expect.any(Number),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					comment_count: expect.any(Number)
				});
			});
		});
		test("200 status and returned array is sorted by date in descending order by default", async () => {
			const { status, body } = await supertest(app).get("/api/articles");
			expect(status).toBe(200);
			expect(body).toBeSortedBy("created_at", { descending: true });
		});
		test("200 status and returned array is sorted by the given valid field, descending by default", async () => {
			let { status, body } = await supertest(app).get(
				"/api/articles?sort_by=title"
			);
			expect(status).toBe(200);
			expect(body).toBeSortedBy("title", { descending: true });

			const response = await supertest(app).get("/api/articles?sort_by=topic");
			status = response.status;
			body = response.body;
			expect(status).toBe(200);
			expect(body).toBeSortedBy("topic", { descending: true });
		});
		test("200 status and returned array is sorted in the given direction", async () => {
			let { status, body } = await supertest(app).get(
				"/api/articles?sort_direction=asc"
			);
			expect(status).toBe(200);
			expect(body).toBeSortedBy("created_at", { descending: false });
			const response = await supertest(app).get(
				"/api/articles?sort_direction=desc"
			);
			status = response.status;
			body = response.body;
			expect(status).toBe(200);
			expect(body).toBeSortedBy("created_at", { descending: true });
		});
		test("200 status and returned array is both sorted and ordered by the given values in conjunction", async () => {
			let { status, body } = await supertest(app).get(
				"/api/articles?sort_by=title&sort_direction=asc"
			);
			expect(status).toBe(200);
			expect(body).toBeSortedBy("title", { descending: false });

			const response = await supertest(app).get(
				"/api/articles?sort_direction=asc&sort_by=title"
			);
			status = response.status;
			body = response.body;
			expect(status).toBe(200);
			expect(body).toBeSortedBy("title", { descending: false });
		});
		test("400 status and returns `Bad Request: Invalid input` message, if given invalid sort criteria", async () => {
			const result = await supertest(app).get("/api/articles?sort_by=banana");
			expect(result.status).toBe(400);
			expect(result.body.message).toBe("Bad Request: Invalid input");
		});
		test("400 status and returns `Bad Request: Invalid input` message, if given invalid sort direction", async () => {
			const result = await supertest(app).get(
				"/api/articles?sort_direction=banana"
			);
			expect(result.status).toBe(400);
			expect(result.body.message).toBe("Bad Request: Invalid input");
		});
		test("200 status and returned array is filtered by the given topic value", async () => {
			let { status, body } = await supertest(app).get(
				"/api/articles?topic=mitch"
			);
			expect(status).toBe(200);
			expect(body.length).toBe(11);
			body.forEach((article) => {
				expect(article.topic).toBe("mitch");
			});

			const response = await supertest(app).get("/api/articles?topic=cats");
			status = response.status;
			body = response.body;
			expect(status).toBe(200);
			expect(body.length).toBe(1);
			body.forEach((article) => {
				expect(article.topic).toBe("cats");
			});
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given invalid topic", async () => {
			const { status, body } = await supertest(app).get(
				"/api/articles?topic=banana"
			);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("200 status and returns 'No articles found' message, if given valid topic which has no articles", async () => {
			const request = await supertest(app).get("/api/articles?topic=paper");
			expect(request.status).toBe(200);
			expect(request.body.message).toBe("No articles found");
		});
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
		test("200 status and returns the specified article object", async () => {
			const { status, body } = await supertest(app).get("/api/articles/1");
			expect(status).toBe(200);
			expect(body).toMatchObject({
				article_id: 1,
				title: "Living in the shadow of a great man",
				body: "I find this existence challenging",
				votes: 100,
				topic: "mitch",
				author: "butter_bridge",
				created_at: "2020-07-09T21:11:00.000Z",
				comment_count: 11
			});
		});
		test("404 status and returns 'Article not found' message, if given an unused valid article_id", async () => {
			const { status, body } = await supertest(app).get("/api/articles/99999");
			expect(status).toBe(404);
			expect(body.message).toBe("Article not found");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given an invalid article_id", async () => {
			const { status, body } = await supertest(app).get("/api/articles/banana");
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
	});
	describe("PATCH", () => {
		test("200 status and returns the patched article object", async () => {
			const patchObj = {
				inc_votes: 5
			};
			const { status, body } = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(status).toBe(200);
			expect(body).toEqual(
				expect.objectContaining({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: "2020-07-09T21:11:00.000Z",
					votes: 105
				})
			);
		});
		test("400 status and returns `Bad Request: key missing from request body` message, if request does not include a inc_votes key", async () => {
			const patchObj = {};
			const { status, body } = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: key missing from request body");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if inc_votes is an invalid datatype", async () => {
			const patchObj = {
				inc_votes: "banana"
			};
			const { status, body } = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("400 status and returns 'Bad Request: Unexpected key' message, if request contains any other keys in addition to inc_votes", async () => {
			const patchObj = {
				inc_votes: 5,
				size: "huge"
			};
			const { status, body } = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Unexpected key");
		});
		test("404 status and returns 'Article not found' message, if given an unused valid article_id", async () => {
			const { status, body } = await supertest(app).get("/api/articles/99999");
			expect(status).toBe(404);
			expect(body.message).toBe("Article not found");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given an invalid article_id", async () => {
			const { status, body } = await supertest(app).get("/api/articles/banana");
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
	});
});

describe("/api/articles/:article_id/comments", () => {
	describe("GET", () => {
		test("200 status and returns array of comments relating to the given article_id", async () => {
			const { status, body } = await supertest(app).get(
				"/api/articles/1/comments"
			);
			expect(status).toBe(200);
			body.forEach((comment) => {
				expect(comment).toMatchObject({
					comment_id: expect.any(Number),
					votes: expect.any(Number),
					created_at: expect.any(String),
					author: expect.any(String),
					body: expect.any(String),
					article_id: 1
				});
			});
		});
		test("404 status and returns 'Article not found' message, if given an unused valid article_id", async () => {
			const { status, body } = await supertest(app).get(
				"/api/articles/99999/comments"
			);
			expect(status).toBe(404);
			expect(body.message).toBe("Article not found");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given an invalid article_id", async () => {
			const { status, body } = await supertest(app).get(
				"/api/articles/banana/comments"
			);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("200 status and returns 'No comments found for this article' message, if given article has no comments", async () => {
			const { status, body } = await supertest(app).get(
				"/api/articles/2/comments"
			);
			expect(status).toBe(200);
			expect(body.message).toBe("No comments found for this article");
		});
	});
	describe("POST", () => {
		test("200 status and returns posted comment", async () => {
			const comment = {
				username: "rogersop",
				body: "this is my comment"
			};
			const { status, body } = await supertest(app)
				.post("/api/articles/1/comments")
				.send(comment);
			expect(status).toBe(200);
			expect(body).toMatchObject({
				comment_id: 19,
				author: "rogersop",
				article_id: 1,
				votes: 0,
				created_at: expect.any(String),
				body: "this is my comment"
			});
			const searchResult = (
				await database.query(`SELECT * FROM comments WHERE comment_id = 19;`)
			).rows[0];
			expect(searchResult).toMatchObject({
				comment_id: 19,
				author: "rogersop",
				article_id: 1,
				votes: 0,
				// created_at: expect.any(String),
				body: "this is my comment"
			});
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given an invalid article_id", async () => {
			const comment = {
				username: "rogersop",
				body: "this is my comment"
			};
			const { status, body } = await supertest(app)
				.post("/api/articles/banana/comments")
				.send(comment);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("404 status and returns 'Article not found' message, if given an unused valid article_id", async () => {
			const comment = {
				username: "rogersop",
				body: "this is my comment"
			};
			const { status, body } = await supertest(app)
				.post("/api/articles/99999/comments")
				.send(comment);
			expect(status).toBe(404);
			expect(body.message).toBe("Article not found");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given a comment with additional keys", async () => {
			const comment = {
				username: "rogersop",
				body: "this is my comment",
				colour: "green"
			};
			const { status, body } = await supertest(app)
				.post("/api/articles/1/comments")
				.send(comment);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given a comment which lacks either username or body keys", async () => {
			// lacks body
			let comment = {
				username: "rogersop",
				colout: "green"
			};
			let { status, body } = await supertest(app)
				.post("/api/articles/1/comments")
				.send(comment);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
			// lacks username
			comment = {
				body: "this is my comment",
				colout: "green"
			};
			const response = await supertest(app)
				.post("/api/articles/1/comments")
				.send(comment);
			status = response.status;
			body = response.body;
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given a comment with invalid datatypesa s values", async () => {
			const comment = {
				username: 7,
				body: true
			};
			const { status, body } = await supertest(app)
				.post("/api/articles/1/comments")
				.send(comment);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
	});
});

describe("/api/comments/:comment_id", () => {
	describe("DELETE", () => {
		test("204 status and returns nothing, deleted comment now can't be found in database", async () => {
			let { status, body } = await supertest(app).delete("/api/comments/1");
			expect(status).toBe(204);
			expect(body).toEqual({});
			const response = (
				await database.query(`SELECT * FROM comments WHERE comment_id = 1`)
			).rows;
			expect(response.length).toBe(0);
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if given an invalid comment_id", async () => {
			let { status, body } = await supertest(app).delete(
				"/api/comments/banana"
			);
			expect(status).toBe(400);
			expect(body.message).toBe("Bad Request: Invalid input");
		});
		test("404 status and returns 'Comment not found' message, if given an unused valid article_id", async () => {
			let { status, body } = await supertest(app).delete("/api/comments/99999");
			expect(status).toBe(404);
			expect(body.message).toBe("Comment not found");
		});
	});
});
