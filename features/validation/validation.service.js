export const validateUser = function (obj) {
  const emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const usernameRegExp = /^([a-zA-Z0-9 _-]){2,32}$/;
  const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

  if (obj["email"] && !new RegExp(emailRegExp).test(obj.email)) return false;
  if (obj["username"] && !new RegExp(usernameRegExp).test(obj.username))
    return false;
  if (obj["password"] && !new RegExp(passwordRegExp).test(obj.password))
    return false;

  return true;
};
