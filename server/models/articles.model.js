const database = require("../../database/connection.js");
const format = require("pg-format");
const { isExtantTopic, vetArticleId } = require("../../database/utils.js");

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

	// Check fort valid sorting and ordering criteria
	if (
		!validSortFields.includes(sort_by) ||
		!(
			sort_direction.toUpperCase() === "ASC" ||
			sort_direction.toUpperCase() === "DESC"
		)
	) {
		throw { status: 400, message: "Bad Request: Invalid input" };
	}

	// Get all articles, in the given order
	const sql = format(
		`
		SELECT * FROM articles
		ORDER BY %s %s
		`,
		sort_by,
		sort_direction
	);
	let articles = (await database.query(sql)).rows;

	// Get all comments
	const comments = (
		await database.query(`
		SELECT * FROM comments;
		`)
	).rows;

	// Add comment_count to each article
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

	if (articles.length === 0) {
		return { status: 200, message: "No articles found" };
	}

	return articles;
};

exports.readArticleById = async (article_id) => {
	await vetArticleId(article_id);

	// Get search results for article
	const article = (
		await database.query(
			`
			SELECT * FROM articles
			WHERE article_id = $1;
			`,
			[article_id]
		)
	).rows[0];

	// Add comment count to article
	article.comment_count = (
		await database.query(
			`
			SELECT * FROM comments
			WHERE article_id = $1;
			`,
			[article_id]
		)
	).rows.length;

	return article;
};

exports.updateArticleById = async (article_id, requestBody) => {
	await vetArticleId(article_id);

	// Check for unexpected number of keys
	if (Object.keys(requestBody).length > 1) {
		throw {
			status: 400,
			message: "Bad Request: Unexpected key"
		};
	}

	// Check inc_votes key is present
	if (!requestBody.inc_votes) {
		throw {
			status: 400,
			message: "Bad Request: key missing from request body"
		};
	}

	// Get return value of patch request
	const updatedArticle = (
		await database.query(
			`
		UPDATE articles
		SET votes = votes + $1
		WHERE article_id = $2
		RETURNING *;
		`,
			[requestBody.inc_votes, article_id]
		)
	).rows[0];

	return updatedArticle;
};

exports.readCommentsByArticleId = async (article_id) => {
	await vetArticleId(article_id);

	const comments = (
		await database.query(
			`
			SELECT * FROM comments WHERE article_id = $1
			`,
			[article_id]
		)
	).rows;
	if (comments.length === 0) {
		throw { status: 200, message: "No comments found for this article" };
	}
	return comments;
};
