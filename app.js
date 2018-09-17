const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./server/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
routes.v1(app);
app.all('*', (req, res) => res.status(404).send({ message: 'Bored were we? Now lost 😁' }));

module.exports = app;
