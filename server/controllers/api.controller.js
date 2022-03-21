const message = require("../greeting.json");

exports.getApiWelcomeMessage = (request, response, next) => {
	try {
		response.status(200).send({ message });
	} catch (error) {
		next(error);
	}
};
