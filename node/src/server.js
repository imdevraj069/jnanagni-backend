import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 8001;

app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60 s-maxage=60');
  res.send('Hello, World!');
});

app.get('/ping/python', async (req, res) => {
  try {
    const response = await axios.get('http://python_app:8002/ping');
    res.json({ message: 'Pinged Python server successfully', data: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Error pinging Python server', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});