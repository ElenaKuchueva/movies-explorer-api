require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
// const limiter = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const allRoutes = require('./routes/allRoutes');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
// app.use(limiter);
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(express.json());

app.use(helmet());
app.use(cors);

app.use(requestLogger);
app.use(allRoutes); // обработчик всех роутов
app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate
app.use(centralErrorHandler); // централизованный обработчик

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });