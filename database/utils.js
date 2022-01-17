const database = require("./connection.js");
const format = require("pg-format");

exports.dropTables = async function () {
	await database.query(`DROP TABLE IF EXISTS comments;`);
	await database.query(`DROP TABLE IF EXISTS articles;`);
	await database.query(`DROP TABLE IF EXISTS topics;`);
	await database.query(`DROP TABLE IF EXISTS users;`);
};

exports.createTables = async function () {
	await database.query(`
  CREATE TABLE topics (
    slug TEXT PRIMARY KEY,
    description TEXT NOT NULL DEFAULT 'No description'
    );
`);
	await database.query(`
  CREATE TABLE users (
    username TEXT PRIMARY KEY,
    avatar_url TEXT DEFAULT 'https://image.pngaaa.com/242/5439242-middle.png',
    name TEXT
  );
  `);
	await database.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    topic TEXT REFERENCES topics(slug),
    author TEXT REFERENCES users(username),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
  `);
	await database.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author TEXT REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id),
    votes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL
  );
  `);
};

exports.insertData = async function (data, tableName) {
	// get fields
	const fields = Object.keys(data[0]).sort();

	// get values
	const values = data.map((datum) => {
		return fields.map((field) => datum[field]);
	});

	const sql = format(
		`
    INSERT INTO %I
    (${fields})
    VALUES %L;
  `,
		tableName,
		values
	);

	await database.query(sql);
};
