const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;
const routes = require('./routes/index');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
