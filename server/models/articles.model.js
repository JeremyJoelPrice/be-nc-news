const database = require("../../database/connection.js");
const format = require("pg-format");
const { isExtantTopic } = require("../../database/utils.js");

exports.readArticles = async ({
	sort_by = "created_at",
	sort_direction = "DESC",
	topic
}) => {
	const validSortFields = [
		"authro",
		"title",
		"article_id",
		"topic",
		"created_at",
		"votes",
		"comment_count"
	];
	if (
		!validSortFields.includes(sort_by) ||
		!(
			sort_direction.toUpperCase() === "ASC" ||
			sort_direction.toUpperCase() === "DESC"
		)
	)
		throw { status: 400, message: "Bad Request: Invalid input" };

	const sql = format(
		`
		SELECT * FROM articles
		ORDER BY %s %s
	`,
		sort_by,
		sort_direction
	);
	let articles = (await database.query(sql)).rows;

	const comments = (await database.query(`
	SELECT * FROM comments;
	`)).rows;

	articles.forEach((article) => {
		const articleComments = comments.filter(
			(comment) => comment.article_id === article.article_id
		);
		article.comment_count = articleComments.length;
		delete article.body;
	});

	// Check topic has a value, and that value exists in the database
	if (topic) {
		if (!(await isExtantTopic(topic))) {
			throw { status: 400, message: "Bad Request: Invalid input" };
		}
		articles = articles.filter((article) => article.topic === topic);
	}

	if (articles.length === 0) return {status: 200, message: "No articles found"};

	return articles;
};

exports.readArticleById = async (article_id) => {
	const articleResponse = await database.query(
		`
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
		[article_id]
	);

	const article = articleResponse.rows[0];
	if (!article) throw { status: 404, message: "Article not found" };

	const commentsResponse = await database.query(
		`
    SELECT * FROM comments
    WHERE article_id = $1;
    `,
		[article_id]
	);

	article.comment_count = commentsResponse.rows.length;
	return article;
};

exports.updateArticleById = async (article_id, requestBody) => {
	if (!requestBody.inc_votes) {
		throw {
			status: 400,
			message: "Bad Request: key missing from request body"
		};
	}
	if (Object.keys(requestBody).length > 1) {
		throw {
			status: 400,
			message: "Bad Request: Unexpected key"
		};
	}
	const response = await database.query(
		`
	UPDATE articles
	SET votes = votes + $1
	WHERE article_id = $2
	RETURNING *;
	`,
		[requestBody.inc_votes, article_id]
	);
	return response.rows[0];
};
