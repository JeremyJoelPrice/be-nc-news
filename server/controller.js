exports.getApiWelcomeMessage = (request, response, next) => {
	response.status(200).send({ message: "Welcome to NC_News API" });
};
