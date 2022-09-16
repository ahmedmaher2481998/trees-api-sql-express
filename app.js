const express = require("express");
const dotenv = require("dotenv");
const sqlite3 = require("sqlite3").verbose();

const app = express();

dotenv.config();

// instantiate sqlite and database
const db = new sqlite3.Database(
	process.env.DATABASE_SOURCE,
	sqlite3.OPEN_READWRITE
);

app.use(express.json());

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

app.get("/trees/:id", (req, res, next) => {
	const sql = "select * from trees where id = ?";
	let params = [req.params.id];
	db.get(sql, params, (err, row) => {
		if (err) {
			next(err);
		} else {
			res.json(row);
		}
	});
});

app.post("/trees", (req, res, next) => {
	const sql = `INSERT INTO trees (name , tree_number ) VALUES (?,?)`;
	const sqlLast = "SELECT * FROM trees ORDER BY id DESC LIMIT 1";

	let params = [req.body.name, req.body.number];

	console.log("params", params);

	db.run(sql, params, (err) => {
		if (err) next(err);
		else
			db.get(sqlLast, [], (err, row) => {
				res.json(row);
			});
	});
});

app.delete("/trees/:id", (req, res, next) => {
	const sql = `DELETE FROM trees WHERE id = ?`;
	params = [req.params.id];

	db.run(sql, params, (err) => {
		if (err) next(err);
		else {
			db.all("select * from trees", [], (err, rows) => {
				res.json(rows);
			});
		}
	});
});
app.use((err, req, res, next) => {
	res.json({ error: "An Error Has happened", msg: err.message });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Listening for port :" + PORT));
