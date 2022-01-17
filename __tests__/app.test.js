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
        })
	});
});

describe.only("/api/topics", () => {
    describe("GET", () => {
        test("200 status and returns array of topics", async () => {
            const response = await supertest(app).get("/api/topics");
            expect(response.status).toBe(200);
            const topics = response.body;
            expect(Array.isArray(topics)).toBe(true);
            topics.forEach((topic) => {
                expect( topic ).toEqual(
                    expect.objectContaining(
                        {
                            slug: expect.any(String),
                            description: expect.any(String)
                        }
                    )
                );
            });
        });
    })
});