const { readTopics } = require("./model.js");

exports.getApiWelcomeMessage = (request, response, next) => {
	response.status(200).send({ message: "Welcome to NC_News API" });
};

exports.getTopics = async (request, response, next) => {
	response.status(200).send(await readTopics());
};
