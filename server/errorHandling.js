exports.handleCustomErrors = (error, request, response, next) => {
	if (error.status && error.message) {
		response.status(error.status).send({ message: error.message });
	} else {
		next(error);
	}
};
exports.handlePsqlErrors = (error, request, response, next) => {
	if (error.code === "22P02") {
		response.status(400).send({ message: "Bad Request: Invalid input" });
	} else {
		next(error);
	}
};
exports.handleServerErrors = (error, request, response, next) => {
	console.log(error);
	response.status(500).send({ message: "Internal Server Error" });
};
