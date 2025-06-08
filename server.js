const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { album, artist, score } = req.body;
  const prompt = `Escreva uma review curta, criativa e pessoal para o álbum '${album}' do artista '${artist}', considerando uma nota de ${score}/100. Fale sobre pontos positivos, negativos e sensações gerais, como um fã de música faria.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 180,
      temperature: 0.8,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.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}`,
        'Content-Type': 'application/json',
      }
    });

    res.json({ suggestion: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao acessar OpenAI' });
  }
});

// Outras rotas (Spotify, Firebase, Last.fm) serão adicionadas depois

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
