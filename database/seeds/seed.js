const { dropTables, createTables, insertData } = require("../utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
	try {
		await dropTables();
		await createTables();
		await insertData(topicData, "topics");
		await insertData(userData, "users");
		await insertData(articleData, "articles");
		await insertData(commentData, "comments");
		console.log("Database seeded");
	} catch (error) {
		console.log(error);
	}
};

module.exports = seed;
