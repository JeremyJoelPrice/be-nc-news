const database = require("../../database/connection.js");

exports.readTopics = async () => {
	const response = await database.query(`SELECT * FROM topics;`);
	return response.rows;
};