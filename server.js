const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let client;

async function getClient() {
  if (!client) {
    client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'testdb',
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
    });
    await client.connect();
  }
  return client;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const db = await getClient();
    await db.query('INSERT INTO usuarios (nome, email, time) VALUES ($1, $2, $3)', [req.body.nome, req.body.email, req.body.time]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao conectar com banco');
  }
});

app.get('/dados', async (req, res) => {
  try {
    const db = await getClient();
    const result = await db.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Banco indisponível' });
  }
});

app.listen(3000, () => console.log('Server rodando na porta 3000'));