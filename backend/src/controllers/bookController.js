const db = require('../db');

exports.getAllBooks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao procurar livros." });
  }
};

exports.createBook = async (req, res) => {
  const { title, author, isbn, description, shelf_location } = req.body;
  try {
    const queryText = `
      INSERT INTO books (title, author, isbn, description, shelf_location)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await db.query(queryText, [title, author, isbn, description, shelf_location]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao registar livro." });
  }
};