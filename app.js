const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const routes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use((req, res, next) => {
  req.user = {
    _id: '639aff2b07dc3c0a124745cf',
  };

  next();
});
app.use('/', routes);
app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT);
