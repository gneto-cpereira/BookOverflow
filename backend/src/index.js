const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.json({ message: "BookOverflow API ativa e organizada!" });
});

app.listen(port, () => {
  console.log(`Servidor a correr em http://localhost:${port}`);
});