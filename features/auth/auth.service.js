import * as db from "../../models";
import bcrypt from "bcryptjs";
import { getUserDataHandler } from "../user/user.service";

export const signUpHandler = async function (userData) {
  const user = await db.User.create(userData);

  const data = Object.keys(user._doc).reduce((acc, key, i, arr) => {
    key !== "password" ? (acc[key] = user._doc[key]) : null;
    return acc;
  }, {});

  return data;
};

export const loginHandler = async function (email, password) {
  const user = await db.User.findOne({ email });

  const throwError = () => {
    const err = new Error("User/password combination not found");
    err.code = 401;
    throw err;
  };

  if (!user) throwError();
  else {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    } else throwError();
  }
};

export const refreshHandler = async function (userId) {
  const user = await db.User.findById(userId);

  if (!user) {
    const err = new Error("User/password combination not found");
    err.code = 401;
    throw err;
  }

  return getUserDataHandler(userId);
};
