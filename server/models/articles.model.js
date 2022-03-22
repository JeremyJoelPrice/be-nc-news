const database = require("../../database/connection.js");
const format = require("pg-format");
const { isExtantTopic, vetArticleId } = require("../../database/utils.js");

exports.readArticles = async ({
	sort_by = "created_at",
	sort_direction = "DESC",
	topic
}) => {
	const validSortFields = [
		"author",
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

	// Prep first part of query
	let sql = format(
		`
		SELECT articles.title, articles.article_id, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
		FROM articles
		LEFT JOIN comments ON comments.article_id = articles.article_id
		`
	);

	// If topic has a value, include it in the query
	if (topic) {
		const isValid = await isExtantTopic(topic);
		if (isValid) {
			sql += format(`WHERE topic = '%s'`, topic);
		} else {
			throw { status: 404, message: "Bad Request: Invalid input" };
		}
	}
	// Prep final part of query
	sql += format(
		`
		GROUP BY articles.article_id
		ORDER BY %s %s
		;`,
		sort_by,
		sort_direction
	);

	// Executre query
	const articles = (await database.query(sql)).rows;

	return articles;
};

exports.readArticleById = async (article_id) => {
	await vetArticleId(article_id);

	// Get search results for article
	const sql = format(
		`
			SELECT articles.article_id, articles.body, articles.created_at, articles.votes, articles.title, articles.author, articles.topic, COUNT(comment_id) AS comment_count
			FROM articles
			LEFT JOIN comments ON comments.article_id = articles.article_id
			WHERE articles.article_id = %s
			GROUP BY articles.article_id
			;
			`,
		article_id
	);
	const response = await database.query(sql);

	return response.rows[0];
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
