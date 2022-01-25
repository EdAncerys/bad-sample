export const handleSetCookie = ({ name, value, exDays, deleteCookie }) => {
  // setting defaults
  let cookieExDays = 1;

  let expires = cookieExDays * 24 * 60 * 60,
    cookieName = "cookie",
    cookieValue = "🍪 value not set!";

  if (name) cookieName = name;
  if (value) cookieValue = JSON.stringify(value);
  if (exDays) cookieExDays = exDays;

  if (deleteCookie) {
    document.cookie = cookieName + `=; expires=${new Date(0)};`;
    console.log(`🍪 ${cookieName} successfully deleted`); // debug
    return;
  }

  const cookie = `${cookieName}=${cookieValue};path=/;max-age=${expires};`; // one cookie at a time
  document.cookie = cookie;
  console.log("🍪  set to: ", cookie); // debug
};

export const handleGetCookie = ({ name }) => {
  // setting defaults
  let cookieName = "";
  if (name) cookieName = name;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookieName}=`);

  if (parts.length >= 2) {
    let COOKIE_VALUE = parts.pop().split(";").shift();
    COOKIE_VALUE = JSON.parse(COOKIE_VALUE);
    console.log("🍪 value: ", COOKIE_VALUE);
    return COOKIE_VALUE;
  } else {
    console.log("🍪 not found");
    return null;
  }
};

export const handleEncryption = ({ jwt }) => {
  if (!jwt) {
    console.log("Token not provided!");
    return;
  }
  const bcrypt = require("bcryptjs");
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(jwt, salt);
  const valid = bcrypt.compareSync(jwt, hash); // validate encrypted token

  if (valid) {
    console.log("Encryption successful!");
    return hash;
  } else {
    console.log("Failed to encrypt the taken!");
  }
};
