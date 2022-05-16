import Cookies from "js-cookie";

export const handleSetCookie = ({ name, value, days, deleteCookie }) => {
  // default values
  let cookieExDays = 1;
  if (days) cookieExDays = days;

  console.log("🍪 list ", Cookies.get()); // debug
  if (deleteCookie) {
    Cookies.remove(name);
    return;
  }
  Cookies.set(name, value, { expires: cookieExDays });
};

export const handleGetCookie = ({ name }) => {
  // console.log("handleGetCookie triggered");

  Cookies.get(name);
};
