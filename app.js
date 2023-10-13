require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimiter');
const allRoutes = require('./routes/allRoutes');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000 } = process.env;

const app = express();
app.use(limiter);
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(express.json());

app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'https://kuchueva-diplom.nomoredomainsicu.ru',
    ],
  }),
);

app.use(requestLogger);
app.use(allRoutes); // обработчик всех роутов
app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate
app.use(centralErrorHandler); // централизованный обработчик

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
