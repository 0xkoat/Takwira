import './config'; 
import express from 'express';
import cors from 'cors';
import stadiumsRouter from './api/stadiums';
import signUpRouter from './api/signUp';
import logInRouter from './api/logIn';
import profileRouter from './api/profile';
import path from "path";

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

app.use('/api/auth/signup', signUpRouter);
app.use('/api/auth/login', logInRouter);
app.use('/api/profile', profileRouter);
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/api/stadiums', stadiumsRouter);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
