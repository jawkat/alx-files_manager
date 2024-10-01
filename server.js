import express from 'express';
import router from './routes/index';

// Configurer le port depuis l'environnement ou par défaut à 5000
const port = parseInt(process.env.PORT, 10) || 5000;

const app = express();

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app;
