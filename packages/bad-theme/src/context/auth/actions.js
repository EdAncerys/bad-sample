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

export const sendEnquireAction = async ({ state, dispatch, enquire }) => {
  console.log("enquireAction triggered");
  const SEND_GRID_API = state.theme.SEND_GRID_API;
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
