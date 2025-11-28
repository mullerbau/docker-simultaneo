const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.urlencoded({ extended: true }));

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

client.connect();

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/submit">
      <input type="text" name="nome" placeholder="Nome" required>
      <button type="submit">Enviar</button>
    </form>
    <a href="/dados">Ver dados</a>
  `);
});

app.post('/submit', async (req, res) => {
  await client.query('INSERT INTO usuarios (nome) VALUES ($1)', [req.body.nome]);
  res.redirect('/');
});

app.get('/dados', async (req, res) => {
  const result = await client.query('SELECT * FROM usuarios');
  res.json(result.rows);
});

app.listen(3000, () => console.log('Server rodando na porta 3000'));