const express = require('express');
let words = require('../words.js');

const {
	idIsNumberMiddleware,
} = require('../middlewares/idIsNumberMiddleware.js');

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

const router = express.Router();

let nextId = words.length + 1;

/**
 * CRUD WORDS
 * GET ALL
 *
 */
//    "/words/"
router.get('/', (request, response) => {
	response.json({ words });
});

/**
 * CRUD WORDS
 * GET ONE
 */
router.get(
	'/:id',
	idIsNumberMiddleware,
	isWordMiddleware,
	(request, response) => {
		const idToFind = Number(request.params.id);

		const findWord = words.find((word) => word.id === idToFind);

		response.json({ word: findWord });
	}
);

/**
 * CRUD WORDS
 * POST ONE Word
 */
router.post('/', (request, response) => {
	// recupérer body
	const newWord = request.body.word;

	words.push({
		id: nextId,
		word: newWord,
	});

	nextId++;

	response.json({
		word: words[words.length - 1],
	});
});

/**
 * CRUD WORDS
 * PUT ONE Word
 */

router.put(
	'/:id',
	idIsNumberMiddleware,
	isWordMiddleware,
	(request, response) => {
		const idToModify = Number(request.params.id);

		const wordToModify = words.find((word) => word.id === idToModify);

		const newWordValue = request.body.word;

		wordToModify.word = newWordValue.toLowerCase();

		response.json(words);
	}
);

/**
 * CRUD WORD
 * DELETE ONE Word
 */
router.delete(
	'/:id',
	idIsNumberMiddleware,
	isWordMiddleware,
	(request, response) => {
		const idToDelete = Number(request.params.id);

		const wordsWithoutWordToDelete = words.filter(
			(word) => word.id !== idToDelete
		);

		words = wordsWithoutWordToDelete;

		response.json(words);
	}
);

router.get('/jeu/random', (request, response) => {
	let index = Math.floor(Math.random() * words.length);

	// ["element", "class", "attribut", "id"]

	const wordElement = words[index];

	if (!wordElement.word) {
		response
			.status(500)
			.json({ error: true, message: "On a fait n'importe quoi :)" });

		return;
	}

	response.json(wordElement);
});

module.exports = router;
