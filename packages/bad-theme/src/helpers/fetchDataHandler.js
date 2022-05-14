import { authenticateAppAction } from "../context";

export const fetchDataHandler = async ({
  method,
  path,
  accept,
  body,
  state,
  options,
  headers,
}) => {
  // -----------------------------------------------
  // 📌 CUSTOM FETCH HANDLER
  // -----------------------------------------------

  method = method || "GET";
  accept = accept || "application/json";

  let jwt = "";
  // if (state) jwt = await authenticateAppAction({ state });

  // 📌 HEADER  Options
  let headerOptions = {
    "Content-Type": "application/json",
    Accept: accept,
    // Authorization: `Bearer ${jwt}`,
    // add CORS headers
    // "Access-Control-Allow-Origin": "*",
    // set cash control headers to 7 days if method is GET
    // ...(method === "GET" ? { "Cache-Control": "s-maxage=86400" } : {}),
    // add custom headers if provided
    ...headers,
  };

  // 📌 Options
  let requestOptions = {
    method,
    headerOptions,
    // add options if provided
    ...options,
    // 🍪 add credentials to the request to incloode cookies
    // credentials: "include",
  };

  // 📌 BODY Options
  if (method !== "GET" && body) {
    requestOptions = {
      ...requestOptions,
      body: JSON.stringify(body),
    };
  }

  try {
    if (!path) throw new Error("No path provided");
    // 📌 make a fetch request to the backend api with the given path
    const response = await fetch(path, requestOptions);
    // testing response status
    let time = `🐞 ${new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })}`;

    // // 📌 get the response body
    // const data = await response.json();
    // console.log("🐞 ", data);
    // log date to console in HH:MM:SS format
    console.log(time);
    console.log("🐞 ", response);

    return response;
  } catch (error) {
    console.log(error);
  }
};
