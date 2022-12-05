// CONTEXT --------------------------------------------------------
import {} from "../context";

export const fetchDataHandler = async ({
  method,
  path,
  accept,
  body,
  state,
  options,
  headers,
  disableCookies,
  isCORSHeaders,
}) => {
  // -----------------------------------------------
  // 📌 CUSTOM FETCH HANDLER
  // -----------------------------------------------
  method = method || "GET";
  accept = accept || "application/json";
  if (isCORSHeaders) disableCookies = true; // 📌 disable sending cookies with requests if CORS header is set
  let isCashControlHeaders =
    method === "GET" && state.auth.ENVIRONMENT !== "DEV"; // 📌 disable cashing in development

  // 📌 TESTING
  let timeNow = new Date();
  let time = `🐞 ${timeNow.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })}`;

  // 📌 CORS header options
  let corsHeaders = {
    "access-control-allow-credentials": true,
    "Access-Control-Allow-Methods":
      "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH",
    "Access-Control-Allow-Origin": "*",
    // "content-type": "application/json; charset=utf-8",
  };

  // 📌 HEADER  Options
  let headerOptions = {
    "Content-Type": "application/json",
    Accept: accept,
    // add CORS headers
    // ...(isCORSHeaders ? corsHeaders : {}),
    // set cash control headers to 7 days if method is GET
    // ...(isCashControlHeaders ? { "Cache-Control": "s-maxage=86400" } : {}),
    // add custom headers if provided
    ...(headers || {}),
  };

  // 📌 Options
  let requestOptions = {
    method,
    headers: headerOptions,
    // CORS mode options
    // ...(isCORSHeaders ? { mode: "no-cors" } : {}),
    // add options if provided
    ...(options || {}),
    // 🍪 add credentials to the request to incloode cookies in all fetch requests if disableCookies 🍪
    credentials: disableCookies ? "omit" : "include",
  };

  let isFormData = headerOptions["Content-Type"].includes(
    "multipart/form-data"
  );

  // 📌 BODY Options
  if (method !== "GET" && body) {
    requestOptions = {
      ...requestOptions,
      body: isFormData ? body : JSON.stringify(body),
    };
  }

  // console.log("🐞 requestOptions", requestOptions); // debug

  try {
    if (!path) throw new Error("No path provided");
    // 📌 make a fetch request to the backend api with the given path
    const response = await fetch(path, requestOptions);
    // let timeTaken = (new Date() - timeNow) / 1000;

    // fetch request timing info
    // console.log(`${time} Fetch time: ${timeTaken}s`);
    // console.log("🐞 URL", path);
    // console.log("🐞 Status", response.status);
    // console.log("🐞 ", path);

    return response;
  } catch (error) {
    // console.log(error);
  }
};
