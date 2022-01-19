const database = require("../../database/connection.js");
const { vetCommentId } = require("../../database/utils");

exports.removeCommentById = async (comment_id) => {
    await vetCommentId(comment_id);

	const response = (
		await database.query(
			`
            DELETE FROM comments
            WHERE comment_id = $1;
            `,
			[comment_id]
		)
	).rows[0];
    return response;
};
