const database = require("../../database/connection.js");

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

exports.updateArticleById = async (article_id, { inc_votes }) => {
	const response = await database.query(
		`
	UPDATE articles
	SET votes = votes + $1
	WHERE article_id = $2
	RETURNING *;
	`,
		[inc_votes, article_id]
	);
	return response.rows[0];
};
