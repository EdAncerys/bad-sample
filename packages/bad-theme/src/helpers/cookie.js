export const handleSetCookie = ({ name, value, exDays, deleteCookie }) => {
  // setting defaults
  let cookieExDays = 1;

  let expires = cookieExDays * 24 * 60 * 60,
    cookieName = "cookie",
    cookieValue = "🍪 value not set!";

  if (name) cookieName = name;
  if (value) cookieValue = JSON.stringify(value);
  if (exDays) cookieExDays = exDays;

  let cookie = `${cookieName}=${cookieValue};path=/;max-age=${expires};`; // cookie params
  // if delete cookie set max-age to 0
  if (deleteCookie) {
    cookie = `${cookieName}= ;path=/;max-age=${new Date(0)};`; // cookie params
  }

  document.cookie = cookie;

  if (deleteCookie) {
    console.log(`🍪 ${cookieName} successfully deleted`); // debug
  } else {
    console.log("🍪  set to: ", cookie); // debug
  }
};

export const handleGetCookie = ({ name }) => {
  // setting defaults
  let cookieName = "";
  if (name) cookieName = name;

  try {
    // get cookie by name
    let cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(cookieName));
    // cookie value
    //if !cookie then return null
    if (!cookie) return null;
    let cookieValue = cookie.split("=")[1];
    // if cookie exists & not empty
    if (cookie && cookieValue) {
      cookieValue = JSON.parse(cookieValue);
      // return cookie value
      console.log("🍪 value: ", cookieValue); // debug
      return cookieValue;
    } else {
      console.log("🍪 not found || not valid"); // debug
      return null;
    }
  } catch (error) {
    console.log("error: " + error);
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
