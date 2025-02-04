require('dotenv').config();
const express = require('express');
const cors = require('cors');

const wordsRouter = require('./routes/wordsRouter.js');

const app = express();
const port = 3000;

let count = 0;

app.use(
	cors({
		origin: 'http://127.0.0.1:5500',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

/*
app.use((request, response, next) => {
	// TODO voir pourquoi http://127.0.0.1:5500/ refuse l'accès
	response.setHeader('Access-Control-Allow-Origin', '*');
	next();
});
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((request, response, next) => {
	console.log('Je suis un middleware global');
	count++;
	next();
});

app.use('/words', wordsRouter);

app.get('/', (request, response) => {
	console.log('Je suis une requête GET sur la route racine /');

	response.json({ message: 'Coucou', timestamp: Date.now() });
});

app.get(
	'/search/actors/:isAdult/:language/:recherche',
	async (request, response) => {
		const { isAdult, language, recherche } = request.params;

		const { page } = request.query;

		let searchPage = page ? page : 1;

		if (isAdult !== 'true' && isAdult !== 'false') {
			response.status(400).json({
				error: true,
				message: "isAdult n'a pas le bon format : true or false",
			});

			return;
		}

		if (language !== 'fr-FR' && language !== 'en-EN') {
			response.status(400).json({
				error: true,
				message: 'language doit être fr-FR ou en-EN',
			});

			return;
		}

		const url = `https://api.themoviedb.org/3/search/person?query=${recherche}&include_adult=${isAdult}&language=${language}&page=${searchPage}`;
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
			},
		};

		const TMDBResponse = await fetch(url, options);
		const data = await TMDBResponse.json();

		response.json(data);
	}
);

app.listen(port, (error) => {
	if (error) {
		console.error(error);
		return;
	}

	console.log(`Serveur lancé sur le port ${port}`);
});
