export const errorHandler = function (e) {
  console.log(e);
};

export const throwError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  throw err;
};
