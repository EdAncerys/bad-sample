// SET CONTEXT ---------------------------------------------------
export const setLoginAction = async ({ dispatch, user }) => {
  console.log("setLoginAction triggered"); //debug
  dispatch({ type: "SET_LOGIN", payload: user });
};

export const setLoadingAction = async ({ dispatch, isLoading }) => {
  console.log("setLoadingAction triggered"); //debug
  dispatch({ type: "SET_LOADING", payload: isLoading });
};

// const handleUserLogin = async ({}) => {
//   console.log("handleUserLogin triggered");
//   if (username === "" || password === "") return;
//   const URL = "http://localhost:8888/events/wp-json/jwt-auth/v1/token";

//   const userCredentials = JSON.stringify({
//     username,
//     password,
//   });
//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: userCredentials,
//   };
//   try {
//     const data = await fetch(URL, requestOptions);
//     const response = await data.json();
//     if (response.token) {
//       const encryptedJWT = handleEncryption({ jwt: response.token }); // encrypting provided jwt
//       handleSetCookie({ name: "events", value: encryptedJWT }); // set cookie in the browser

//       actions.theme.setTaken(response.token);
//       actions.theme.setLogin(true);
//       actions.router.set("/");
//     } else {
//       alert(`${response.message}`);
//     }
//   } catch (error) {
//     console.log("error", error);
//   }
// };
