const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'testdb',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
});

client.connect();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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