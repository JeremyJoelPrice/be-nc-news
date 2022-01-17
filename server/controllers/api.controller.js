exports.getApiWelcomeMessage = (request, response, next) => {
	try {
		response.status(200).send({ message: "Welcome to NC_News API" });
	} catch (error) {
		next(error);
	}
};