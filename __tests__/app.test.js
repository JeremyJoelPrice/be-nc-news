const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
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
					author: expect.any(String),
					title: expect.any(String),
					article_id: expect.any(Number),
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					comment_count: expect.any(Number)
				})
			);
		});
		test("if given an unused valid article_id, 404 status and returns 'Article not found' message", async () => {
			const response = await supertest(app).get("/api/articles/99999");
			expect(response.status).toBe(404);
			expect(response.body.message).toBe("Article not found");
		});
		test.only("if given an invalid article_id, 400 status and returns 'Invalid input' message", async () => {
			const response = await supertest(app).get("/api/articles/banana");
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Invalid input");
		});
	});
});
