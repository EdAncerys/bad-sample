import { authenticateAppAction } from "../context";

export const fetchDataHandler = async ({
  method,
  path,
  accept,
  body,
  state,
  options,
  headers,
  disableCookies,
  isCORSHeader,
}) => {
  // -----------------------------------------------
  // 📌 CUSTOM FETCH HANDLER
  // -----------------------------------------------

  method = method || "GET";
  accept = accept || "application/json";
  disableCookies = disableCookies || false;
  isCORSHeader = isCORSHeader || false;
  if (isCORSHeader) disableCookies = false; // disable sending cookies with requests if CORS header is set

  // 📌 TESTING
  let timeNow = new Date();
  let time = `🐞 ${timeNow.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })}`;

  // let jwt = "";
  // if (state) jwt = await authenticateAppAction({ state });

  // 📌 CORS header options
  let corsHeaders = {
    "access-control-allow-credentials": true,
    "Access-Control-Allow-Methods":
      "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH",
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json; charset=utf-8",
  };

  // 📌 HEADER  Options
  let headerOptions = {
    "Content-Type": "application/json",
    Accept: accept,
    // Authorization: `Bearer ${jwt}`,
    // add CORS headers
    // ...(isCORSHeader ? corsHeaders : {}),
    // set cash control headers to 7 days if method is GET
    // ...(method === "GET" ? { "Cache-Control": "s-maxage=86400" } : {}),
    // add custom headers if provided
    ...headers,
  };

  // 📌 Options
  let requestOptions = {
    method,
    headerOptions,
    // CORS mode options
    // ...(isCORSHeader ? { mode: "no-cors" } : {}),
    // add options if provided
    ...options,
    // 🍪 add credentials to the request to incloode cookies in all fetch requests if disableCookies 🍪
    // ...(disableCookies ? {} : { credentials: "include" }),
    credentials: disableCookies ? "omit" : "include",
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
    let timeTaken = (new Date() - timeNow) / 1000;

    // log date to console in HH:MM:SS format
    console.log(time);
    // time taken to execute fetch request in seconds
    console.log(`Fetch time: ${timeTaken}s`);
    console.log("🐞 Status", response.status);

    return response;
  } catch (error) {
    console.log(error);
  }
};
