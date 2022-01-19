exports.getApiWelcomeMessage = (request, response, next) => {
	try {
		response.status(200).send({message: {
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
		}});
	} catch (error) {
		next(error);
	}
};
