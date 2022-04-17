const db = require("../../models"),
  bcrypt = require("bcryptjs");

exports.signUpHandler = function (
  userData,
  setSessionVariable,
  respondWithData,
  catchError
) {
  db.User.create(userData)
    .then((user) => {
      setSessionVariable(user._id);

      const data = Object.keys(user._doc).reduce((acc, key, i, arr) => {
        key !== "password" ? (acc[key] = user._doc[key]) : null;
        return acc;
      }, {});

      respondWithData(data);
    })
    .catch((err) => catchError(err));
};

exports.loginHandler = function (
  email,
  password,
  userPasswordNotFoundResponse,
  setSessionVariable,
  respondWithSuccess,
  catchError
) {
  db.User.findOne({ email })
    .then((user) => {
      if (!user) {
        userPasswordNotFoundResponse();
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          setSessionVariable(user._id);

          respondWithSuccess(user);
        } else userPasswordNotFoundResponse();
      }
    })
    .catch((err) => catchError(err));
};

exports.refreshHandler = function (
  userId,
  userPasswordNotFoundResponse,
  getUserData,
  respondWithFilteredData,
  catchError
) {
  db.User.findById(userId)
    .then(function (user) {
      if (!user) userPasswordNotFoundResponse();

      getUserData(userId, respondWithFilteredData, catchError);
    })
    .catch((err) => catchError(err));
};
