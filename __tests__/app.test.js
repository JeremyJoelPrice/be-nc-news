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
		test("200 status and returns an array of articles", async () => {
			const response = await supertest(app).get("/api/articles");
			expect(Array.isArray(response.body)).toBe(true);
			response.body.forEach((article) => {
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
			const response = await supertest(app).get("/api/articles");
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("created_at", { descending: true });
		});
		test("200 status and returned array is sorted by the given valid field, descending by default", async () => {
			let response = await supertest(app).get("/api/articles?sort_by=title");
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("title", { descending: true });

			response = await supertest(app).get("/api/articles?sort_by=topic");
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("topic", { descending: true });
		});
		test("200 status and returned array is sorted in the given direction", async () => {
			let response = await supertest(app).get(
				"/api/articles?sort_direction=asc"
			);
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("created_at", { descending: false });
			response = await supertest(app).get(
				"/api/articles?sort_direction=desc"
			);
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("created_at", { descending: true });
		});
		test("200 status and returned array is both sorted and ordered by the given values in conjunction", async () => {
			let response = await supertest(app).get("/api/articles?sort_by=title&sort_direction=asc");
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("title", {descending: false});
			
			response = await supertest(app).get("/api/articles?sort_direction=asc&sort_by=title");
			expect(response.status).toBe(200);
			expect(response.body).toBeSortedBy("title", {descending: false});
		});
		test("400 status and returns `Bad Request: Invalid input` message, if given invalid sort criteria", async () => {
			const result = await supertest(app).get("/api/articles?sort_by=banana");
			expect(result.status).toBe(400);
			expect(result.body.message).toBe("Bad Request: Invalid input");
		});
		test("400 status and returns `Bad Request: Invalid input` message, if given invalid sort direction", async () => {
			const result = await supertest(app).get("/api/articles?sort_direction=banana");
			expect(result.status).toBe(400);
			expect(result.body.message).toBe("Bad Request: Invalid input");
		});
		// filter by field
		// if given invalid field
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
