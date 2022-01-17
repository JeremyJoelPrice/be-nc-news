const { readTopics } = require("../models/index.js");

exports.getTopics = async (request, response, next) => {
	try {
		response.status(200).send(await readTopics());
	} catch (error) {
		next(error);
	}
};
