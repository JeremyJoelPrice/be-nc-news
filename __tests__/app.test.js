const db = require("../database/connection.js");
const testData = require("../database/data/test-data/index.js");
const seed = require("../database/seeds/seed.js");
const app = require("../server/app.js");
const supertest = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
	describe("GET", () => {
		test("status 200 and returns welcome message", async () => {
			const response = await supertest(app).get("/api");
			expect(response.status).toBe(200);
			expect(response.body.message).toBe("Welcome to NC_News API");
		});
	});
});

describe("/api/topics", () => {
	describe("GET", () => {
		test("200 status and returns array of topics", async () => {
			const response = await supertest(app).get("/api/topics");
			expect(response.status).toBe(200);
			const topics = response.body;
			expect(Array.isArray(topics)).toBe(true);
			topics.forEach((topic) => {
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
		// returns array of articles
		test.only("200 status and returns an array of articles", async () => {
			const response = await supertest(app).get("/api/articles");
			expect(Array.isArray(response.body)).toBe(true);
			response.body.forEach((article) => {
				expect(typeof article.author).toBe("string");
				expect(typeof article.title).toBe("string");
				expect(typeof article.article_id).toBe("number");
				expect(typeof article.topic).toBe("string");
				expect(typeof article.created_at).toBe("string");
				expect(typeof article.votes).toBe("number");
				expect(typeof article.comment_count).toBe("number");
				expect(article).toEqual(
					expect.objectContaining({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(Number)
					})
				);
			});
		});
		// array has default sort criteria and sort direction
		// sort array by any criteria
		// error if given invalid sort criteria
		// error if given invalid sort direction (asc/desc)
		// filter by topic
		// error if given invalid topic
		// if given topic has no associated articles...?
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET", () => {
		test("200 status and returns the specified article object", async () => {
			const response = await supertest(app).get("/api/articles/1");
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				expect.objectContaining({
					article_id: 1,
					title: "Living in the shadow of a great man",
					body: "I find this existence challenging",
					votes: 100,
					topic: "mitch",
					author: "butter_bridge",
					created_at: "2020-07-09T21:11:00.000Z",
					comment_count: 11
				})
			);
		});
		test("if given an unused valid article_id, 404 status and returns 'Article not found' message", async () => {
			const response = await supertest(app).get("/api/articles/99999");
			expect(response.status).toBe(404);
			expect(response.body.message).toBe("Article not found");
		});
		test("if given an invalid article_id, 400 status and returns 'Bad Request: Invalid input' message", async () => {
			const response = await supertest(app).get("/api/articles/banana");
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Bad Request: Invalid input");
		});
	});
	describe("PATCH", () => {
		test("200 status and returns the patched article obejct", async () => {
			const patchObj = {
				inc_votes: 5
			};
			const response = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
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
			const response = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(response.status).toBe(400);
			expect(response.body.message).toBe(
				"Bad Request: key missing from request body"
			);
		});
		test("400 status and returns 'Bad Request: Invalid input' message, if inc_votes is an invalid datatype", async () => {
			const patchObj = {
				inc_votes: "banana"
			};
			const response = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Bad Request: Invalid input");
		});
		test("400 status and returns 'Bad Request: Unexpected key' message, if request contains any other keys in addition to inc_votes", async () => {
			const patchObj = {
				inc_votes: 5,
				size: "huge"
			};
			const response = await supertest(app)
				.patch("/api/articles/1")
				.send(patchObj);
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Bad Request: Unexpected key");
		});
	});
});
