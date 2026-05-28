import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
