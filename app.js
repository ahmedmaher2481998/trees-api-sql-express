const express = require("express");
const dotenv = require("dotenv");
const sqlite3 = require("sqlite3");

dotenv.config();

// instantiate sqlite and database
const db = new sqlite3.Database(
	process.env.DATABASE_SOURCE,
	sqlite3.OPEN_READWRITE
);

const app = express();
app.get("/trees", (req, res, next) => {
	const sql = "select * from trees;";
	let params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			next(err);
		}
		res.json(rows);
	});
});

const PORT = 5000;
app.listen(PORT, () => console.log("Listening for port :" + PORT));
