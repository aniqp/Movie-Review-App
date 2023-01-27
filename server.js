let mysql = require('mysql');
let config = require('./config.js');
const fetch = require('node-fetch');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));


app.post('/api/loadUserSettings', (req, res) => {

	let connection = mysql.createConnection(config);
	let userID = req.body.userID;

	let sql = `SELECT mode FROM user WHERE userID = ?`;
	console.log(sql);
	let data = [userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});

app.post('/api/getMovies', (req, res) => {

	let connection = mysql.createConnection(config);
	let sql = `SELECT id, name, year, quality FROM movies`

	console.log(sql)

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		console.log(results);
		let string = JSON.stringify(results);
		let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();

})

app.post('/api/addReview', (req, res) => {

	let connection = mysql.createConnection(config)
	let fullReview = req.body.fullReview

	let sql = `INSERT INTO review (reviewTitle, reviewContent, reviewScore, userID, movieID)
	VALUES ('${fullReview.reviewTitle}', '${fullReview.reviewContent}', '${fullReview.reviewScore}', '${fullReview.userID}', '${fullReview.movieID}')`;

	console.log(sql);
	// console.log(data);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let success = JSON.stringify('Success')
		res.send({ express: success })
	});
	connection.end();
})

app.post('/api/searchMovies', (req, res) => {
	let connection = mysql.createConnection(config)
	let movieSearchTerm = req.body.movieSearchTerm + '%'
	let actorSearchTerm = req.body.actorSearchTerm + '%'
	let directorSearchTerm = '%' + req.body.directorSearchTerm + '%'

	let sql = `SELECT temp.movie_title, temp.director_name, temp.average_review, GROUP_CONCAT(r.reviewContent SEPARATOR ';;;;;') review_content FROM (
		SELECT m.name movie_title, m.id movie_id, GROUP_CONCAT(DISTINCT d.first_name, " ", d.last_name SEPARATOR ', ') director_name, GROUP_CONCAT(DISTINCT a.first_name, " ", a.last_name) actor_name, AVG(reviewScore) average_review
		FROM movies m
		INNER JOIN movies_directors md
		ON md.movie_id = m.id
		INNER JOIN directors d
		ON d.id = md.director_id
	   INNER JOIN roles ro
	   ON ro.movie_id = m.id
	   INNER JOIN actors a
	   ON a.id = ro.actor_id
	   LEFT JOIN review r
		ON r.movieID = m.id
	   WHERE m.name LIKE ?
		AND CONCAT(a.first_name, " ", a.last_name) LIKE ?
		GROUP BY m.name, m.id) temp
LEFT JOIN review r
ON r.movieID = temp.movie_id
WHERE temp.director_name LIKE ?
GROUP BY temp.movie_title, temp.director_name, temp.average_review`

	let data = [movieSearchTerm, actorSearchTerm, directorSearchTerm]

	console.log(sql);
	// console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		console.log(results);
		let string = JSON.stringify(results);
		let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();

})

app.post('/api/searchActors', (req, res) => {

	let connection = mysql.createConnection(config)
	let actorSearchTerm = req.body.actorSearchTerm + '%'

	let sql = `SELECT CONCAT(first_name, " ", last_name) actor_name, GROUP_CONCAT("Movie: ", name, " | Played:  ", role SEPARATOR ';;;;;') movie_role FROM
	actors
	INNER JOIN roles
	ON roles.actor_id = actors.id
	INNER JOIN movies
	ON movies.id = roles.movie_id
	WHERE CONCAT(first_name, " ", last_name) LIKE '${actorSearchTerm}'
	GROUP BY CONCAT(first_name, " ", last_name)
	ORDER BY CONCAT(first_name, " ", last_name)`;

	console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results)
		res.send({ express: string })
	});
	connection.end();
})

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
// app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
