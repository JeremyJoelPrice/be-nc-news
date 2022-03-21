const { readTopics } = require("../models/index.js");

exports.getTopics = async (request, response, next) => {
	try {
		const topics = await readTopics();
		response.status(200).send({ topics });
	} catch (error) {
		next(error);
	}
};
