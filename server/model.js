const db = require("../db/connection.js");

exports.readTopics = async () => {
	const response = await db.query(`SELECT * FROM topics;`);
	return response.rows;
};

exports.readArticleById = async (article_id) => {
	const articleResponse = await db.query(
		`
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
		[article_id]
	);

	const article = articleResponse.rows[0];
	if (!article) throw { status: 404, message: "Article not found" };

	const commentsResponse = await db.query(
		`
    SELECT * FROM comments
    WHERE article_id = $1;
    `,
		[article_id]
	);

	article.comment_count = commentsResponse.rows.length;
	return article;
};
