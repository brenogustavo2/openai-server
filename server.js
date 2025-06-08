const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 ROTA SEGURA PARA LAST.FM
app.get('/api/lastfm', async (req, res) => {
  try {
    const base = 'https://ws.audioscrobbler.com/2.0/';
    const queryParams = new URLSearchParams({
      ...req.query,
      api_key: process.env.LASTFM_API_KEY,
      format: 'json'
    });

    const url = `${base}?${queryParams.toString()}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Erro da Last.fm:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao acessar a Last.fm' });
  }
});


// 🔒 ROTA SEGURA PARA OBTER TOKEN DO SPOTIFY
app.get('/api/spotify-token', async (req, res) => {
  try {
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Erro ao obter token do Spotify:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao obter token do Spotify' });
  }
});


// 🔁 OBRIGATÓRIO para funcionar no Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


