const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🎧 Obter token do Spotify
app.get('/api/spotify-token', async (req, res) => {
  try {
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post('https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao obter token do Spotify' });
  }
});

// 🎵 Usar API da Last.fm sem expor chave
app.get('/api/lastfm', async (req, res) => {
  try {
    const { method, artist, album, track } = req.query;
    const url = `https://ws.audioscrobbler.com/2.0/?method=${method}&artist=${encodeURIComponent(artist || '')}&album=${encodeURIComponent(album || '')}&track=${encodeURIComponent(track || '')}&api_key=${process.env.LASTFM_API_KEY}&format=json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao acessar a Last.fm' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
