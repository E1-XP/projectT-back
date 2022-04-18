import dotEnv from "dotenv";
dotEnv.config();

import mongoose from "mongoose";

import user from "./features/user/user.model.js";
import timeEntry from "./features/entries/entry.model.js";

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

export const URL = mongoose.connect(process.env.MONGO_URL, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
});

export const User = user;
export const TimeEntry = timeEntry;
