import { setLoginModalAction } from "../index";

export const loginAction = async ({ dispatch, user }) => {
  console.log("loginAction triggered");

  const username = user.username;
  const password = user.password;
  if (username === "" || password === "") {
    console.log("Credentials provided not valid");
    return;
  }
  const URL = "https://skylarkdev.digital/dynamicsbridge/users/login";

  // const userCredentials = JSON.stringify({
  //   username,
  //   password,
  // });
  const userCredentials = JSON.stringify({
    username: "ed.ancerys",
    password: "h98H*(H9h9hiuuitg7g*f6ftu",
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, OPTIONS",
    },
    body: userCredentials,
  };
  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    console.log(response);
    seJWTAction({ dispatch, jwt: "token" }); // add jwt to context
    // if (response.token) {
    //   const encryptedJWT = handleEncryption({ jwt: response.token }); // encrypting provided jwt
    //   handleSetCookie({ name: "events", value: encryptedJWT }); // set cookie in the browser
    // } else {
    //   alert(`${response.message}`);
    // }
  } catch (error) {
    console.log("error", error);
  }
};

export const authenticateAppAction = async ({ state }) => {
  console.log("authenticateAppAction triggered");

  // const username = state.auth.APP_USERNAME;
  // const password = state.auth.APP_PASSWORD;
  // const URL = state.auth.APP_AUTH_URL;

  // const appCredentials = JSON.stringify({
  //   username,
  //   password,
  // });

  // const requestOptions = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Headers":
  //       "Origin, X-Requested-With, Content-Type, Accept",
  //     "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, OPTIONS",
  //   },
  //   body: appCredentials,
  // };
  // try {
  //   const data = await fetch(URL, requestOptions);
  //   const response = await data.json();
  //   console.log(response);
  //   // if (response.token) {
  //   //   const encryptedJWT = handleEncryption({ jwt: response.token }); // encrypting provided jwt
  //   //   handleSetCookie({ name: "events", value: encryptedJWT }); // set cookie in the browser
  //   // } else {
  //   //   alert(`${response.message}`);
  //   // }
  // } catch (error) {
  //   console.log("error", error);
  // }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    username: "ed.ancerys",
    password: "UJHb7(&*&HhbgibjkK",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://skylarkdev.digital/dynamicsbridge/users/login", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const sendEnquireAction = async ({ state, dispatch, enquire }) => {
  console.log("enquireAction triggered");
  const SEND_GRID_API = state.auth.SEND_GRID_API;
  console.log("SEND_GRID_API", SEND_GRID_API);
};

// SET CONTEXT ---------------------------------------------------
export const setLoginAction = ({ dispatch, loginAction }) => {
  console.log("setLoginAction triggered"); //debug
  dispatch({ type: "SET_LOGIN_ACTION", payload: true });

  setLoginModalAction({ dispatch, loginModalAction: false });
};

export const seJWTAction = ({ dispatch, jwt }) => {
  console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
