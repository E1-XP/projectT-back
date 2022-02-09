require("dotenv").config();

const express = require("express"),
  app = express(),
  session = require("express-session"),
  MongoDBStore = require("connect-mongodb-session")(session),
  bodyParser = require("body-parser"),
  compression = require("compression"),
  cors = require("cors"),
  PORT = process.env.PORT || 3001,
  ORIGIN_URL = ["http://localhost:8080", "https://project-t-v2.netlify.app"];

const db = require("./models");
const routes = require("./routes");
const { URL } = require("./models");

const store = new MongoDBStore({
  uri: URL,
  collection: "sessions",
});

module.exports = { ORIGIN_URL };

app.use(bodyParser.json());
app.use(
  cors({
    origin: ORIGIN_URL,
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    // cookieName: 'session',
    secret: process.env.SECRET_KEY,
    cookie: {
      // ephemeral: true,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
    store,
    saveUninitialized: false,
    resave: false,
  })
);

// app.use(session({
//     cookieName: 'persistentSession',
//     secret: process.env.SECRET_KEY,
//     duration: 180 * 24 * 60 * 60 * 1000, //6months
//     cookie: {
//         httpOnly: true
//     }
// }));

app.use(compression());

app.use(express.static("public"));

app.use("/", routes);

app.listen(PORT, () => console.log(`Listening on ${PORT}.`));
