require('dotenv').config();

const express = require('express'),
    app = express(),
    session = require('client-sessions'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    PORT = process.env.PORT || 3001;

const db = require('./models');
const routes = require('./routes');
const middleware = require('./middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: `http://localhost:8080`,
    credentials: true
}));

app.use(session({
    cookieName: 'session',
    secret: process.env.SECRET_KEY,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true
}));

app.use(middleware.checkForSession);

app.use('/', routes);

app.listen(PORT, () => console.log(`Listening on ${PORT}.`));