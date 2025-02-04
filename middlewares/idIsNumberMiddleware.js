const idIsNumberMiddleware = (request, response, next) => {
	const id = Number(request.params.id);

	if (isNaN(id)) {
		response.status(400).json({
			error: true,
			message: "L'id attendu doit être un nombre",
		});
	} else {
		next();
	}
};

const otherMiddleware = () => {};

module.exports = { idIsNumberMiddleware, otherMiddleware };
