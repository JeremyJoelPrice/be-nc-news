const db = require("../db/connection.js");

exports.readTopics = async () => {
	const response = await db.query(`SELECT * FROM topics;`);
    return response.rows;
};
