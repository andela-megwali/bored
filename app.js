const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./server/routes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);
app.get('*', (req, res) => res.status(200).send({ message: 'Bored were we? Now lost 😁' }));

module.exports = app;
