import dotEnv from "dotenv";
dotEnv.config();

import express from "express";
const app = express();

import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
const MongoDBStore = connectMongoDBSession(session);

import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
const PORT = process.env.PORT || 3001;

import { config } from "./config/index.js";

import * as db from "./models.js";
import { router as routes } from "./routes.js";

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: config.ORIGIN_URL,
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    name: "session",
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
//     name: 'persistentSession',
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
