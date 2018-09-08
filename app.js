require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./server/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
routes(app);
app.get('*', (req, res) => res.status(200).send({ message: 'Bored were we? Now lost 😁' }));

module.exports = app;
