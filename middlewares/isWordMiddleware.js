const isWordMiddleware = (request, response, next) => {
	const idToFind = Number(request.params.id);

	const findWord = words.find((word) => word.id === idToFind);

	if (!findWord) {
		response.status(404).json({
			error: true,
			message: "Il n'y a pas de mot avec cet id",
		});
	} else {
		next();
	}
};

module.exports = isWordMiddleware;
