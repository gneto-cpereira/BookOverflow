const db = require('../db');

// --- CREATE ---
exports.createBook = async (req, res) => {
  const { title, author, isbn, description, shelf_location } = req.body;
  isbn = isbn.replace(/[- ]/g, "");
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

// --- READ ---
exports.getAllBooks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao procurar livros." });
  }
};

exports.getExternalBook = async (req, res) => {
  const isbn = req.params.isbn.replace(/[- ]/g, "");

  try {
    // 1º TRY: Google Books
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    let data = await response.json();

    if (data.totalItems > 0) {
      const info = data.items[0].volumeInfo;
      return res.json({
        title: info.title,
        author: info.authors ? info.authors.join(', ') : 'Desconhecido',
        isbn: isbn
      });
    }

    // 2º TRY: Open Library (Fallback para livros PT)
    response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    data = await response.json();

    const bookKey = `ISBN:${isbn}`;
    if (data[bookKey]) {
      const info = data[bookKey];
      return res.json({
        title: info.title,
        author: info.authors ? info.authors.map(a => a.name).join(', ') : 'Desconhecido',
        isbn: isbn
      });
    }

    // Catch
    res.status(404).json({ error: "Livro não encontrado em nenhuma base de dados." });

  } catch (err) {
    res.status(500).json({ error: "Erro na comunicação com as APIs externas." });
  }
};

// --- DELETE ---
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM books WHERE id = $1', [id]);
    res.status(200).json({ message: "Livro removido com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar livro" });
  }
};

// --- UPDATE ---
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn } = req.body;

  try {
    const queryText = `
      UPDATE books
      SET title = $1, author = $2, isbn = $3
      WHERE id = $4 RETURNING *;
    `;
    const result = await db.query(queryText, [title, author, isbn, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Livro não encontrado." });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar livro." });
  }
}