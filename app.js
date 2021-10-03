require('dotenv').config();

const express = require('express'),
    app = express(),
    session = require('client-sessions'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    PORT = process.env.PORT || 3001,
    ORIGIN_URL = 'http://localhost:8080';
      // 'https://e1-xp.github.io';


const db = require('./models');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(cors({
    origin: ORIGIN_URL,
    credentials: true
}));

app.use(session({
    cookieName: 'session',
    secret: process.env.SECRET_KEY,
    cookie: {
        ephemeral: true,
        httpOnly: true
    }
}));

app.use(session({
    cookieName: 'persistentSession',
    secret: process.env.SECRET_KEY,
    duration: 180 * 24 * 60 * 60 * 1000, //6months
    cookie: {
        httpOnly: true
    }
}));

app.use(compression());

app.use(express.static('public'));

app.use('/', routes);

app.listen(PORT, () => console.log(`Listening on ${PORT}.`));
