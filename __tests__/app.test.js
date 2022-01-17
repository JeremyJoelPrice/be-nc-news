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
		test("if given an invalid article_id, 400 status and returns 'Invalid input' message", async () => {
			const response = await supertest(app).get("/api/articles/banana");
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Invalid input");
		});
	});
});
